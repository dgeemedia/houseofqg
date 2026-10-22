import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity'
import { sendOrderEmail } from '@/lib/email'
import { notify } from '@/lib/notify'
import { sendWhatsApp } from '@/lib/whatsapp'
const ok = () => NextResponse.json({ ok: true })
/** FLUTTERWAVE_FORWARDS="runserv_=https://runserv.org/api/webhook,store_=https://elorgestore.org/api/webhook". The first prefix that matches the payment's tx_ref wins.
 *  The original body and verif-hash header are sent unchanged, so each site checks the same secret hash itself. Never throws, so Flutterwave always gets a 200. */
async function forward(txRef: string, raw: string, req: NextRequest) {
  if (req.headers.get('x-forwarded-by')) return // never forward twice (prevents loops)
  const rule = (process.env.FLUTTERWAVE_FORWARDS || '').split(',').map((x) => x.trim()).filter(Boolean).map((x) => { const i = x.indexOf('='); return [x.slice(0, i).trim(), x.slice(i + 1).trim()] }).find(([pre, url]) => pre && /^https:\/\//.test(url) && txRef.startsWith(pre))
  if (!rule) { console.warn('[webhook] no forward rule for tx_ref', txRef.slice(0, 12)); return }
  const r = await fetch(rule[1], { method: 'POST', headers: { 'Content-Type': 'application/json', 'verif-hash': req.headers.get('verif-hash') || '', 'x-forwarded-by': 'houseofqg' }, body: raw, signal: AbortSignal.timeout(8000) }).catch((err) => { console.error('[webhook] forward failed', rule[1], err?.message); return null })
  if (r && !r.ok) console.error('[webhook] forward got', r.status, rule[1])
}
export async function POST(req: NextRequest) {
  if (req.headers.get('verif-hash') !== process.env.FLUTTERWAVE_SECRET_HASH) return NextResponse.json({ error: 'bad signature' }, { status: 401 })
  const raw = await req.text(), e = JSON.parse(raw || '{}'), d = e?.data
  // One Flutterwave account = one webhook URL. Payments for the other companies' sites (different tx_ref prefix) are passed on to them.
  if (!String(d?.tx_ref || '').startsWith('qg_')) { await forward(String(d?.tx_ref || ''), raw, req); return ok() }
  if (e?.event !== 'charge.completed' || d?.status !== 'successful') return ok()
  const order: any = await writeClient.getDocument(`order-${d.tx_ref}`)
  if (!order || order.status !== 'pending') return ok() // retry-safe
  // Re-verify with Flutterwave; never trust the payload alone
  const v = (await fetch(`https://api.flutterwave.com/v3/transactions/${d.id}/verify`, { headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}` } }).then((r) => r.json()))?.data
  const cur = order.payCurrency || 'NGN', expected = order.payAmount ?? order.total
  if (v?.status !== 'successful' || v?.tx_ref !== d.tx_ref || v?.currency !== cur) return NextResponse.json({ error: 'verify failed' }, { status: 400 })
  if (Number(v.amount) + 0.01 < expected) { await writeClient.patch(order._id).set({ notes: `UNDERPAID: got ${cur} ${v.amount}, expected ${expected}` }).commit(); return ok() }
  try { await writeClient.patch(order._id).ifRevisionId(order._rev).set({ status: 'paid', transactionId: String(d.id) }).commit() }
  catch (err: any) { if (err?.statusCode === 409) return ok(); throw err }
  for (const i of order.items || []) { // decrement tracked stock and count units sold, once
    const p: any = await writeClient.getDocument(i.productId)
    if (p) { let pt = writeClient.patch(p._id).setIfMissing({ soldUnits: 0 }).inc({ soldUnits: i.units }); if (p.stockUnits != null) pt = pt.set({ stockUnits: Math.max(0, p.stockUnits - i.units) }); await pt.commit() }
  }
  if (order.claimId) await writeClient.patch(order.claimId).set({ status: 'paid' }).commit().catch(() => {})
  const totalText = `₦${Math.round(order.total).toLocaleString('en-NG')}`
  await notify(`New paid order ${order.reference}${order.promoCode ? ' · ' + order.promoCode : ''}\n${order.name} · ${order.phone}\nTotal ${totalText}${cur !== 'NGN' ? ` (paid ${cur} ${order.payAmount})` : ''}\nDelivery: ${order.logisticsPartner || (order.delivery === 'pickup' ? 'Pickup' : 'Standard')}${order.logisticsZone ? ' / ' + order.logisticsZone : ''}${order.deliveryArea ? ' (' + order.deliveryArea + ')' : ''}\nPack: ${(order.items || []).map((i: any) => `${i.quantity}× ${i.productName}${i.variant ? ' (' + i.variant + ')' : ''}`).join('; ')}\nWaybill: ${process.env.NEXT_PUBLIC_SITE_URL}/invoice/${order.viewKey}?waybill=1`)
  await sendOrderEmail(order)
  if (order.whatsappOptIn) await sendWhatsApp(order.phone, process.env.WA_TEMPLATE_PAID || 'order_confirmed', [order.name || 'there', order.reference, totalText], order.lang)
  return ok()
}
