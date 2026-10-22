import './globals.css'
import Link from 'next/link'
import { Fraunces, Manrope } from 'next/font/google'
import { CartProvider } from '@/lib/cart'
import { getSettings, getActivePromo } from '@/lib/sanity'
import CartLink from '@/components/CartLink'
import Intro from '@/components/Intro'
import PWA from '@/components/PWA'
import Analytics from '@/components/Analytics'
import ChatWidget from '@/components/ChatWidget'
import HeaderSearch from '@/components/HeaderSearch'
import { LangProvider, T } from '@/lib/i18n'
import { DEFAULT_ADDRESS, DEFAULT_ADDRESS_LINE } from '@/lib/site'
const body = Manrope({ subsets: ['latin'], variable: '--font' })
const display = Fraunces({ subsets: ['latin'], variable: '--display', style: ['normal', 'italic'], axes: ['opsz'] })
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofqg.com'
const DESC = 'Shop House of QG: dresses, sets and statement pieces. Join Fastest Finger drops, Black Friday sales and new arrivals, with delivery across Nigeria.'
export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'House of QG | Fashion, Fastest Finger drops & Black Friday', template: '%s | House of QG' },
  description: DESC,
  keywords: ['House of QG', 'fashion brand Nigeria', 'women clothing Nigeria', 'dresses Lagos', 'two piece sets Nigeria', 'Black Friday fashion Nigeria', 'fastest finger sale', 'buy clothes online Nigeria'],
  applicationName: 'House of QG',
  formatDetection: { telephone: false },
  // Search Console / Bing / Meta (Instagram & Facebook Shop) domain verification, filled from env vars.
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION, other: { ...(process.env.BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } : {}), ...(process.env.META_DOMAIN_VERIFICATION ? { 'facebook-domain-verification': process.env.META_DOMAIN_VERIFICATION } : {}) } },
  openGraph: { type: 'website', siteName: 'House of QG', locale: 'en_NG', url: SITE, title: 'House of QG', description: DESC, images: [{ url: '/og.png', width: 1200, height: 630, alt: 'House of QG: Fashion, Style, You' }] },
  twitter: { card: 'summary_large_image', title: 'House of QG', description: DESC, images: ['/og.png'] },
}
export const viewport = { themeColor: '#f5efe6' }
export const revalidate = 60
const orgLd = { '@context': 'https://schema.org', '@graph': [{ '@type': ['Organization', 'OnlineStore'], name: 'House of QG', url: SITE, logo: `${SITE}/icon-512.png`, address: { '@type': 'PostalAddress', streetAddress: DEFAULT_ADDRESS.street, addressLocality: DEFAULT_ADDRESS.locality, addressRegion: DEFAULT_ADDRESS.region, addressCountry: 'NG' } }, { '@type': 'WebSite', name: 'House of QG', url: SITE }] }
export default async function Root({ children }: { children: React.ReactNode }) {
  const [s, promo] = await Promise.all([getSettings().then((x) => x || {}), getActivePromo().catch(() => null)])
  /** While a sale titled or badged "Black Friday" is live, the whole store switches to its black-and-gold theme. */
  const bf = /black\s*friday/i.test(`${promo?.badge || ''} ${promo?.title || ''}`)
  const socials: [string, string][] = ([['Instagram', s.instagramUrl], ['TikTok', s.tiktokUrl], ['Facebook', s.facebookUrl], ['X', s.xUrl], ['YouTube', s.youtubeUrl], ['LinkedIn', s.linkedinUrl], ['Snapchat', s.snapchatUrl], ['Pinterest', s.pinterestUrl], ['Threads', s.threadsUrl], ['Telegram', s.telegramUrl], ['WhatsApp', s.whatsappNumber && `https://wa.me/${s.whatsappNumber}`]] as [string, string][]).filter(([, u]) => u)
  const org = { ...orgLd['@graph'][0], sameAs: socials.filter(([l]) => l !== 'WhatsApp').map(([, u]) => u), ...(s.phone || s.email ? { contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer service', areaServed: 'NG', availableLanguage: 'en', ...(s.phone ? { telephone: s.phone } : {}), ...(s.email ? { email: s.email } : {}) }] } : {}) }
  const site = { ...orgLd['@graph'][1], potentialAction: { '@type': 'SearchAction', target: `${SITE}/?q={search_term_string}`, 'query-input': 'required name=search_term_string' } }
  const ld = { ...orgLd, '@graph': [org, site] }
  /** The House of QG logo: ink on light pages, cream when the theme is dark (see globals.css). */
  const Mark = () => <span className="brandmark"><img className="lg-i" src="/logo-ink.png" width={132} height={58} alt="House of QG" /><img className="lg-c" src="/logo-cream.png" width={132} height={58} alt="House of QG" /></span>
  return (
    <html lang="en-NG"><body className={`${body.variable} ${display.variable}`} data-sale={bf ? 'bf' : undefined}><CartProvider><LangProvider>
      <Intro url={s.introVideoUrl} />
      <Analytics />
      <ChatWidget />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {s.announcement && <div className="bar">{s.announcement}</div>}
      <header className="top"><div className="wrap hdr">
        <nav className="hl"><Link href="/#shop"><T k="nav.shop" /></Link><Link href="/#drop"><T k="nav.drops" /></Link><Link href="/size-guide"><T k="nav.size" /></Link></nav>
        <Link href="/" aria-label="House of QG home" style={{ display: 'contents' }}><Mark /></Link>
        <div className="hnav"><HeaderSearch /><Link href="/track"><T k="nav.track" /></Link><Link href="/account"><T k="nav.account" /></Link><CartLink /></div>
      </div></header>
      <PWA />
      {children}
      <footer><div className="wrap">
        <div className="fgrid">
          <div><Link href="/" className="doorway" aria-label="House of QG"><img src="/logo-gold.png" alt="House of QG" width={190} height={84} /></Link><div className="fqt">Fashion <i>•</i> Style <i>•</i> You</div><p style={{ marginTop: 14 }}><T k="f.tag" /></p></div>
          <div><h4><T k="f.shop" /></h4><Link href="/#shop"><T k="f.all" /></Link><Link href="/#drop"><T k="nav.drops" /></Link><Link href="/size-guide"><T k="f.size" /></Link><Link href="/track"><T k="f.track" /></Link><Link href="/cart"><T k="f.cart" /></Link><Link href="/account"><T k="f.account" /></Link><Link href="/contact"><T k="f.card" /></Link></div>
          <div><h4><T k="f.contact" /></h4>{s.phone && <span>{s.phone}</span>}{s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}{s.whatsappNumber && <a href={`https://wa.me/${s.whatsappNumber}`}><T k="f.whatsapp" /></a>}<span>{s.address || DEFAULT_ADDRESS_LINE}</span><Link href="/contact" className="fcard"><T k="f.cardCta" /></Link>{socials.length > 0 && <><h4 style={{ marginTop: 18 }}><T k="f.follow" /></h4><div className="social">{socials.map(([l, u]) => <a key={l} href={u} target="_blank" rel="noopener noreferrer">{l}</a>)}</div></>}</div>
          <div><h4><T k="f.why" /></h4><span><T k="f.why1" /></span><span><T k="f.why2" /></span><span><T k="f.why3" /></span><span><T k="f.why4" /></span></div>
        </div>
        <div className="fbase"><span>© {Math.max(2026, new Date().getFullYear())} House of QG{s.cacNumber ? ` · RC ${s.cacNumber}` : ''} · <T k="f.rights" /> · <Link href="/legal/terms"><T k="f.terms" /></Link> · <Link href="/legal/privacy"><T k="f.privacy" /></Link> · <Link href="/legal/returns"><T k="f.returns" /></Link></span><span className="credit">Powered by <b>Elorge Technologies Limited</b></span></div>
      </div></footer>
    </LangProvider></CartProvider></body></html>
  )
}
