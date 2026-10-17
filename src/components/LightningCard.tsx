'use client'
import { useState } from 'react'
import { naira } from '@/lib/cart'
import { useLang } from '@/lib/i18n'
import Countdown from './Countdown'
/** Fastest Finger: first taps win. After a tap the piece is held for a few minutes; the winner picks a size and pays. */
export default function LightningCard({ deal }: { deal: any }) {
  const { t, te, lang } = useLang()
  const [claim, setClaim] = useState<any>(null), [f, setF] = useState<any>({ delivery: 'delivery' }), [sel, setSel] = useState<Record<string, string>>({}), [err, setErr] = useState(''), [busy, setBusy] = useState(false), [left, setLeft] = useState(deal.left)
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value })
  const opts: any[] = deal.product.options || []
  const post = (body: any) => fetch('/api/lightning', { method: 'POST', body: JSON.stringify(body) }).then(async (r) => ({ ok: r.ok, d: await r.json().catch(() => ({})) }))
  async function grab() {
    setBusy(true); setErr('')
    const { ok, d } = await post({ action: 'claim', dealId: deal.id })
    if (ok) { setClaim(d); setLeft((l: number) => Math.max(0, l - 1)) } else { setErr(d.error ? te(d.error) : t('lt.sorry')); if (/sold out|gone|too slow|ended/i.test(d.error || '')) setLeft(0) }
    setBusy(false)
  }
  async function pay() {
    if (opts.some((g) => !sel[g.name]) || !f.name || !/^\S+@\S+\.\S+$/.test(f.email || '') || (f.phone || '').replace(/\D/g, '').length < 10 || (f.delivery !== 'pickup' && (!f.address || !f.state))) return setErr(t('lt.complete'))
    setBusy(true); setErr('')
    const { ok, d } = await post({ action: 'pay', claimId: claim.claimId, token: claim.token, lang, sel, ...f })
    if (ok && d.link) location.href = d.link; else { setErr(d.error ? te(d.error) : t('e.payFail')); setBusy(false) }
  }
  const total = deal.units || left
  return (<section className="drop" id="drop">
    <div className="arch"><img src={deal.product.img} alt={deal.product.name} /></div>
    <div>
      <span className="live"><i />{t('lt.live')} · {t('lt.tag')}</span>
      <h2 className="display">{deal.title}</h2><div style={{ opacity: .8 }}>{deal.product.name}</div>
      <div className="price" style={{ margin: '10px 0' }}>{naira(deal.price)}<span className="was">{naira(deal.product.was)}</span></div>
      <div>{t('h.endsIn')} <Countdown endsAt={deal.endsAt} /></div>
      <div className="left" aria-hidden><i style={{ width: `${total ? Math.max(4, (left / total) * 100) : 0}%` }} /></div>
      <div style={{ marginBottom: 14 }}><b>{t('lt.left', { n: left })}</b></div>
      {!claim ? (<><button className="btn green" disabled={busy || left < 1} onClick={grab}>{left < 1 ? t('p.soldOut') : busy ? t('lt.grabbing') : t('lt.grab')}</button>{err && <p className="err">{err}</p>}</>) : (<div>
        <p style={{ fontWeight: 700, color: 'var(--gold-lt)' }}>{t('lt.won1')}<Countdown endsAt={claim.expiresAt} />{t('lt.won2')}</p>
        {opts.map((g) => <div key={g.name}><small style={{ letterSpacing: '.14em', textTransform: 'uppercase' }}>{g.name}{sel[g.name] ? ` — ${sel[g.name]}` : ''}</small><div className="sizepick">{g.values.map((v: string) => <button key={v} type="button" className={sel[g.name] === v ? 'on' : ''} onClick={() => setSel({ ...sel, [g.name]: v })}>{v}</button>)}</div></div>)}
        <div className="f"><input placeholder={t('c.name')} onChange={set('name')} /><input placeholder={t('c.email')} type="email" onChange={set('email')} /><input placeholder={t('c.phone')} type="tel" onChange={set('phone')} />
          <select onChange={set('delivery')}><option value="delivery">{t('c.deliver')}</option><option value="pickup">{t('c.pickup')}</option></select>
          {f.delivery !== 'pickup' && <><input placeholder={t('c.addr')} onChange={set('address')} /><input placeholder={t('a.state')} onChange={set('state')} /></>}</div>
        {err && <p className="err">{err}</p>}<button className="btn green" disabled={busy} onClick={pay}>{busy ? t('c.wait') : t('lt.pay', { amt: naira(deal.price) })}</button>
        <p className="trust">{t('lt.receipt')}</p></div>)}
    </div></section>)
}
