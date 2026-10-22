import Link from 'next/link'
import { client, getProducts, getActivePromo, getSettings, getLightning, withPromo, urlFor } from '@/lib/sanity'
import ProductCard from '@/components/ProductCard'
import Shop from '@/components/Shop'
import Countdown from '@/components/Countdown'
import { T } from '@/lib/i18n'
import Ticker from '@/components/Ticker'
import Welcome from '@/components/Welcome'
import LightningCard from '@/components/LightningCard'
export const revalidate = 30
export const metadata = { alternates: { canonical: '/' } }
/** "Wear it like *you mean it.*" : text between asterisks is set in italic wine/gold. */
const Headline = ({ text }: { text: string }) => <>{text.split('*').map((x, i) => (i % 2 ? <em key={i}>{x}</em> : x))}</>
export default async function Home() {
  const [products, promo, s, deal] = await Promise.all([getProducts(), getActivePromo(), getSettings(), getLightning()])
  const list = withPromo(products, promo)
  const server = !!s?.features?.serverSearch
  const facets = server ? await client.fetch(`{"cats": array::unique(*[_type=="product" && active!=false && defined(category)].category), "sizes": array::unique(*[_type=="product" && active!=false].options[][name match "size*"].values[])}`) : undefined
  const onSale = list.filter((p: any) => p.promoUnitPrice || p.promoDozenPrice)
  const isBf = /black\s*friday/i.test(`${promo?.badge || ''} ${promo?.title || ''}`)
  const welcome = list.slice(0, 24).map((p: any) => ({ slug: p.slug, name: p.name, price: p.promoUnitPrice ?? p.unitPrice, sale: !!p.promoUnitPrice, img: urlFor(p.images[0]).width(420).height(525).url() }))
  const dealProp = deal && { id: deal._id, title: deal.title, price: deal.dealPrice, endsAt: deal.endsAt, left: deal.left, units: deal.units, hold: deal.holdMinutes || 5, product: { name: deal.product.name, slug: deal.product.slug, was: deal.product.unitPrice, options: deal.product.options || [], img: urlFor(deal.product.images[0]).width(700).height(930).url() } }
  // Category tiles: the first piece of each category provides the picture.
  const catMap = new Map<string, any>()
  list.forEach((p: any) => { if (p.category && !catMap.has(p.category)) catMap.set(p.category, p) })
  const cats = [...catMap.entries()].slice(0, 6)
  const heroImgs = [s?.heroImage ? urlFor(s.heroImage).width(760).height(1060).url() : list[0] && urlFor(list[0].images[0]).width(760).height(1060).url(), list[1] && urlFor(list[1].images[0]).width(600).height(840).url()].filter(Boolean) as string[]
  const stamp = isBf ? ['Black', 'Friday'] : dealProp ? ['Live', 'drop'] : ['New', 'in']
  return (<>
    <Welcome items={welcome} />
    <Ticker items={s?.tickerItems} />
    <div className="wrap">
      <section className="hero">
        <div>
          <span className="kicker"><T k="h.heroKicker" /></span>
          <h1><Headline text={s?.heroTitle || 'Wear it like *you mean it.*'} /></h1>
          <p>{s?.heroSubtitle || 'New drops, statement sets and everyday pieces. Be quick: our Fastest Finger drops go in minutes.'}</p>
          <div className="row"><a href="#shop" className="btn"><T k="h.heroCta" /></a><a href="#drop" className="btn ghost"><T k="h.dropCta" /></a></div>
        </div>
        <div className="hero-art">
          {heroImgs.length ? heroImgs.map((src, i) => <Link key={i} href="/#shop" className="arch"><img src={src} alt="" /></Link>) : <div className="arch ph">QG</div>}
          <div className="stamp"><span>{stamp[0]}</span><b>{stamp[1]}</b></div>
        </div>
      </section>
      {dealProp && <LightningCard deal={dealProp} />}
      {promo && (<section className="flash" style={{ marginTop: dealProp ? 22 : 0 }}><div><span className="kicker">{promo.badge || <T k="p.flash" />}</span><h2 className="display">{promo.title}</h2><div style={{ opacity: .8 }}><T k="h.endsIn" /></div></div><Countdown endsAt={promo.endsAt} /></section>)}
      {!!onSale.length && <><h3 className="sec" id="sale"><T k="h.deals" /></h3><div className="strip">{onSale.map((p: any) => <div key={p._id} style={{ flex: '0 0 220px' }}><ProductCard p={p} /></div>)}</div></>}
      {cats.length > 1 && <><h3 className="sec"><T k="h.shopBy" /></h3><div className="cats">{cats.map(([c, p]) => (
        <Link key={c} href={`/?cat=${encodeURIComponent(c)}#shop`} className="cat"><div className="arch"><img src={urlFor(p.images[0]).width(480).height(640).url()} alt={c} loading="lazy" /></div><b>{c}</b><small><T k="h.view" /> →</small></Link>))}</div></>}
      <h3 className="sec" id="shop"><T k="h.newIn" /><a href="#shop"><T k="h.shopAll" /></a></h3>
      <Shop products={list} server={server} facets={facets} />
      {!list.length && <p>Add your first piece in <a href="/studio"><u>/studio</u></a>.</p>}
      <h3 className="sec" id={dealProp ? undefined : 'drop'}><T k="h.ffTitle" /></h3>
      <p style={{ color: 'var(--mute)', maxWidth: '56ch', marginTop: -8 }}><T k="h.ffIntro" /></p>
      <div className="how">{[1, 2, 3].map((n) => <div key={n}><span className="n">0{n}</span><b><T k={`h.ff${n}t`} /></b><span><T k={`h.ff${n}d`} /></span></div>)}</div>
    </div></>)
}
