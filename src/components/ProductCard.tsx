'use client'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { naira } from '@/lib/cart'
import { useLang } from '@/lib/i18n'
import QuickAdd from './QuickAdd'
/** Portrait product card: the second photo fades in on hover, size chips show what is available. */
export default function ProductCard({ p }: { p: any }) {
  const { t } = useLang(), name = p.name
  const sale = p.promoUnitPrice, price = sale ?? p.unitPrice, out = p.stockUnits === 0
  const off = sale ? Math.round((1 - sale / p.unitPrice) * 100) : 0
  const pack = p.promoDozenPrice ?? p.dozenPrice
  const href = `/product/${p.slug}`
  const label = sale ? p.promoBadge || t('p.flash') : p.isNew ? 'NEW' : ''
  return (
    <div className="card pc">
      <div className="pc-wrap">
        {label && <span className="tag">{label}</span>}
        <Link href={href} className="pc-link" aria-label={name}>
          <div className="pc-img" style={out ? { opacity: 0.55 } : {}}>
            <img src={urlFor(p.images[0]).width(560).height(700).url()} alt={name} loading="lazy" />
            {p.images[1] && <img className="b" src={urlFor(p.images[1]).width(560).height(700).url()} alt="" loading="lazy" />}
          </div>
        </Link>
        {!out && <QuickAdd image={urlFor(p.images[0]).width(120).height(150).url()} i={{ _id: p._id, name: p.name, slug: p.slug, hasOptions: !!p.options?.length, unit: price, dozen: pack, tiers: p.tiers, pack: p.packSize || 12, packLabel: p.packLabel || 'bundle', kg: p.weightKg }} />}
      </div>
      <Link href={href} className="in">
        <div className="pc-name">{name}</div>
        <div className="price">{naira(price)}{sale && <span className="was">{naira(p.unitPrice)}</span>}{off > 0 && <span className="off">-{off}%</span>}</div>
        {!!p.sizes?.length && <div className="sizes">{p.sizes.slice(0, 7).map((s: string) => <i key={s}>{s}</i>)}</div>}
        {p.rating ? <div className="pc-meta"><span style={{ color: 'var(--gold)' }}>★</span> {p.rating.toFixed(1)} ({p.reviewCount})</div> : null}
        {out && <div className="err" style={{ fontSize: 13, marginTop: 4 }}>{t('p.soldOut')}</div>}
      </Link>
    </div>
  )
}
