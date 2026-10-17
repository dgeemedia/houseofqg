import Link from 'next/link'
import QRCode from 'qrcode'
import { getSettings } from '@/lib/sanity'
import { contactLinks, e164 } from '@/lib/vcard'
import { LOGO_PNG_B64 } from '@/lib/logoData'
import { DEFAULT_ADDRESS_LINE } from '@/lib/site'
export const revalidate = 300
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofqg.com'
export const metadata = { title: 'Contact card', description: 'Scan the QR code or tap Save to add House of QG to your phone contacts: phone, WhatsApp, email and social media.', alternates: { canonical: '/contact' } }
/** QR that points at /contact.vcf. The code never changes, so a printed one keeps working even if you update your phone number or links in Studio. */
async function qrSvg() {
  const raw = await QRCode.toString(`${SITE}/contact.vcf`, { type: 'svg', margin: 2, errorCorrectionLevel: 'H', color: { dark: '#0c0808', light: '#fffaf3' } })
  const n = Number((raw.match(/viewBox="0 0 (\d+)/) || [])[1] || 0), box = Math.round(n * 0.24), at = (n - box) / 2
  const logo = `<rect x="${at - 0.6}" y="${at - 0.6}" width="${box + 1.2}" height="${box + 1.2}" rx="2" fill="#fffaf3"/><image x="${at}" y="${at}" width="${box}" height="${box}" href="data:image/png;base64,${LOGO_PNG_B64}"/>`
  return n ? raw.replace('</svg>', `${logo}</svg>`) : raw
}
export default async function Contact() {
  const s = (await getSettings()) || {}
  const svg = await qrSvg()
  const phone = e164(s.phone), wa = (s.whatsappNumber || '').replace(/\D/g, '')
  const socials = contactLinks(s).filter((l) => l.label !== 'Website' && l.label !== 'WhatsApp')
  const none = !phone && !s.email && !wa && !socials.length
  return (<div className="wrap cc">
    <div className="ccard">
      <span className="doorway"><img src="/logo-gold.png" alt="House of QG" width={260} height={114} /></span>
      <h1 className="display">House of QG</h1>
      <div className="fqt">Fashion <i>•</i> Style <i>•</i> You</div>
      <a className="btn green csave" href="/contact.vcf">Save to my contacts</a>
      <div className="clinks">
        {phone && <a href={`tel:${phone}`}><b>Call</b><span>{s.phone}</span></a>}
        {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"><b>WhatsApp</b><span>Chat with us</span></a>}
        {s.email && <a href={`mailto:${s.email}`}><b>Email</b><span>{s.email}</span></a>}
        <a href="/"><b>Website</b><span>houseofqg.com</span></a>
        {socials.map((l) => <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"><b>{l.label}</b><span>Follow us</span></a>)}
      </div>
      <p className="caddr"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address || DEFAULT_ADDRESS_LINE)}`} target="_blank" rel="noopener noreferrer">{s.address || DEFAULT_ADDRESS_LINE}</a></p>
      {none && <p className="caddr">Add your phone, email and social links in Studio &gt; Site settings and they appear here.</p>}
    </div>
    <div className="qrbox">
      <span className="kicker">Scan me</span>
      <div className="qr" role="img" aria-label="QR code that saves the House of QG contact" dangerouslySetInnerHTML={{ __html: svg }} />
      <p>Point your phone camera at the code. Your phone will offer to add <b>House of QG</b> with our number, email and social links.</p>
      <a className="btn ghost" download="HouseOfQG-contact-qr.svg" href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}>Download QR code</a>
      <small>Print it on tags, packaging and flyers. It keeps working even if you change your details later.</small>
    </div>
  </div>)
}
