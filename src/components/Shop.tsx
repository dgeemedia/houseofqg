'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import ProductCard from './ProductCard'
import { useLang } from '@/lib/i18n'
const price = (p: any) => p.promoUnitPrice ?? p.unitPrice
const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', 'One size']
/** Local mode filters the products already loaded. Server mode (switch in Studio) searches and pages through the API, so it scales past 300 pieces. */
export default function Shop({ products, server, facets }: { products: any[]; server?: boolean; facets?: { cats: string[]; sizes?: string[] } }) {
  const [q, setQ] = useState(''), [cat, setCat] = useState('All'), [size, setSize] = useState('All'), [sort, setSort] = useState('featured'), [shown, setShown] = useState(24)
  const [rows, setRows] = useState<any[]>(products), [total, setTotal] = useState(products.length), [page, setPage] = useState(0), [busy, setBusy] = useState(false)
  const first = useRef(true), { t } = useLang()
  useEffect(() => { const u = new URLSearchParams(location.search), q0 = u.get('q'), c0 = u.get('cat'); if (q0) setQ(q0); if (c0) setCat(c0) }, [])
  const sortSizes = (a: string[]) => [...new Set(a)].sort((x, y) => (SIZE_ORDER.indexOf(x) + 1 || 99) - (SIZE_ORDER.indexOf(y) + 1 || 99) || x.localeCompare(y))
  const cats = server ? facets?.cats || [] : ([...new Set(products.map((p) => p.category).filter(Boolean))] as string[])
  const sizes = server ? facets?.sizes || [] : sortSizes(products.flatMap((p) => p.sizes || []))
  async function load(p: number) {
    setBusy(true)
    const qs = new URLSearchParams({ q, cat: cat === 'All' ? '' : cat, size: size === 'All' ? '' : size, sort, page: String(p) })
    const r = await fetch(`/api/products?${qs}`).then((x) => x.json()).catch(() => null)
    setBusy(false); if (!r?.items) return
    setRows((cur) => (p === 0 ? r.items : [...cur, ...r.items])); setTotal(r.total); setPage(p)
  }
  useEffect(() => { if (!server) return; if (first.current) { first.current = false; return } const t = setTimeout(() => load(0), 300); return () => clearTimeout(t) }, [q, cat, size, sort, server])
  const local = useMemo(() => {
    const t = q.toLowerCase()
    const r = products.filter((p) => (cat === 'All' || p.category === cat) && (size === 'All' || (p.sizes || []).includes(size)) && `${p.name} ${p.category} ${p.description || ''}`.toLowerCase().includes(t))
    return sort === 'low' ? [...r].sort((a, b) => price(a) - price(b)) : sort === 'high' ? [...r].sort((a, b) => price(b) - price(a)) : sort === 'new' ? [...r].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew)) : r
  }, [products, q, cat, size, sort])
  const list = server ? rows : local, count = server ? total : local.length
  const Item = ({ label, on, n, set }: any) => <li><button className={on ? 'on' : ''} onClick={set}>{label} {n != null && <small>({n})</small>}</button></li>
  return (<div className="mkt">
    <aside className="side">
      <input placeholder={t('nav.searchPh')} value={q} onChange={(e) => setQ(e.target.value)} />
      <h4>{t('s.cats')}</h4><ul><Item label={t('s.all')} n={server ? null : products.length} on={cat === 'All'} set={() => setCat('All')} />
        {cats.map((c) => <Item key={c} label={c} n={server ? null : products.filter((p) => p.category === c).length} on={cat === c} set={() => setCat(c)} />)}</ul>
      {!!sizes.length && <><h4>{t('s.size')}</h4><ul><Item label={t('s.all')} on={size === 'All'} set={() => setSize('All')} />{sizes.map((z) => <Item key={z} label={z} on={size === z} set={() => setSize(z)} />)}</ul></>}
      <h4>{t('s.sort')}</h4><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">{t('s.featured')}</option><option value="new">{t('s.newest')}</option><option value="low">{t('s.low')}</option><option value="high">{t('s.high')}</option></select>
    </aside>
    <div><small style={{ color: 'var(--mute)', letterSpacing: '.12em', textTransform: 'uppercase', fontSize: 11 }}>{t(count === 1 ? 's.product1' : 's.products', { n: count })}{busy && ` · ${t('s.loading')}`}</small>
      <div className="grid" style={{ marginTop: 14 }}>{(server ? list : list.slice(0, shown)).map((p) => <ProductCard key={p._id} p={p} />)}</div>
      {server ? (rows.length < total && <div style={{ textAlign: 'center', margin: 28 }}><button className="btn ghost" disabled={busy} onClick={() => load(page + 1)}>{t('s.more', { n: total - rows.length })}</button></div>)
        : (list.length > shown && <div style={{ textAlign: 'center', margin: 28 }}><button className="btn ghost" onClick={() => setShown(shown + 24)}>{t('s.more', { n: list.length - shown })}</button></div>)}
      {!list.length && !busy && <p>{t('s.none')}</p>}</div>
  </div>)
}
