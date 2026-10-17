'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCart, naira } from '@/lib/cart'
import { linePrice, tierUnit } from '@/lib/tiers'
import { useLang } from '@/lib/i18n'
export default function BuyBox({ p, image }: { p: any; image: string }) {
  const { add } = useCart(), { t, tr } = useLang()
  const pack = p.packSize || 12, label = p.packLabel || 'bundle'
  const unit = p.promoUnitPrice ?? p.unitPrice, dozen = p.promoDozenPrice ?? p.dozenPrice
  const [mode, setMode] = useState<'unit' | 'dozen'>('unit'), [qty, setQty] = useState(1), [done, setDone] = useState(false)
  const units = mode === 'dozen' ? qty * pack : qty
  const lp = (m: 'unit' | 'dozen') => linePrice(m, unit, dozen, p.tiers, units, pack) ?? (m === 'dozen' ? dozen : unit)
  const price = lp(mode)
  const tiers = [...(p.tiers || [])].sort((a: any, b: any) => a.minUnits - b.minUnits)
  const next = tiers.find((x: any) => x.minUnits > units && x.unitPrice < (mode === 'dozen' ? price / pack : price))
  const out = p.stockUnits === 0
  const [sel, setSel] = useState<Record<string, string>>({})
  const missing = (p.options || []).find((g: any) => !sel[g.name])
  const isSize = (n: string) => /size/i.test(n)
  return (<div>
    <div className="price" style={{ fontSize: 26, fontFamily: 'var(--display)', fontWeight: 500 }}>{naira(price)}{p.promoUnitPrice && <span className="was" style={{ fontSize: 16 }}>{naira(p.unitPrice)}</span>}</div>
    {dozen && <div className="opt">
      <label className={mode === 'unit' ? 'on' : ''} onClick={() => setMode('unit')}><b>{t('b.unit')}</b><br />{naira(lp('unit'))}</label>
      <label className={mode === 'dozen' ? 'on' : ''} onClick={() => setMode('dozen')}><b>{t('b.per', { n: pack })}</b><br />{naira(lp('dozen'))}<br /><small>{naira(lp('dozen') / pack)} {t('b.each')}</small></label>
    </div>}
    {!!tiers.length && <div className="ladder"><b>{t('b.ladder')}</b>{tiers.map((x: any) => (
      <div key={x.minUnits} className={tierUnit(p.tiers, units) === x.unitPrice ? 'hit' : ''}><span>{t('b.units', { n: x.minUnits })}</span><b>{t('b.eachPrice', { price: naira(x.unitPrice) })}</b></div>))}</div>}
    {(p.options || []).map((g: any) => (<div key={g.name} style={{ margin: '20px 0 8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><b style={{ letterSpacing: '.14em', textTransform: 'uppercase', fontSize: 12 }}>{g.name}{sel[g.name] ? ` — ${sel[g.name]}` : ''}</b>{isSize(g.name) && <Link href="/size-guide" target="_blank" style={{ fontSize: 12, textDecoration: 'underline' }}>{t('b.sizeGuide')}</Link>}</div>
      <div className="sizes-row">{g.values.map((v: string) => <button key={v} type="button" className={`sizebtn ${sel[g.name] === v ? 'on' : ''}`} onClick={() => setSel({ ...sel, [g.name]: v })}>{v}</button>)}</div></div>))}
    {p.fitNote && <p style={{ color: 'var(--mute)', fontSize: 14, margin: '14px 0 0' }}><b style={{ color: 'var(--ink)' }}>Fit:</b> {p.fitNote}</p>}
    <div style={{ display: 'flex', gap: 12, margin: '22px 0 0', alignItems: 'stretch' }}>
      <input aria-label={t('b.qty')} type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value || 1))} style={{ width: 84, textAlign: 'center' }} />
      <button className="btn" style={{ flex: 1 }} disabled={out || !!missing} onClick={() => { add({ productId: p._id, name: p.name, mode, quantity: qty, image, unit, dozen, tiers: p.tiers, pack, packLabel: label, sel, kg: p.weightKg }); setDone(true) }}>{out ? t('p.soldOut') : missing ? t('b.choose', { name: missing.name }) : t('b.add')}</button>
    </div>
    {qty > 1 && <p style={{ margin: '8px 0 0' }}>{t('b.total')}: <b>{naira(price * qty)}</b></p>}
    {next && <p style={{ color: 'var(--wine)', fontWeight: 700 }}>{t('b.next', { n: next.minUnits - units, price: naira(next.unitPrice) })}</p>}
    {done && <p><a href="/cart"><u>{t('b.added')}</u></a></p>}
    <p className="trust">{tr('ship.', p.dispatchTime || 'Ships in 2-3 days')} · {t('f.why3')}</p>
  </div>)
}
