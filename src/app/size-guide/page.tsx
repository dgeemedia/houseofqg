import Link from 'next/link'
import { getSettings } from '@/lib/sanity'
export const revalidate = 300
export const metadata = { title: 'Size guide', description: 'Find your size at House of QG: body measurements in inches and how to measure yourself.', alternates: { canonical: '/size-guide' } }
/** Placeholder chart so the page is never empty. Replace it with your own measurements in Studio > Site Settings > Size chart. */
const DEFAULT = [
  { size: 'XS', ukSize: '6', bust: '32', waist: '25', hips: '35' },
  { size: 'S', ukSize: '8', bust: '34', waist: '27', hips: '37' },
  { size: 'M', ukSize: '10-12', bust: '36', waist: '29', hips: '39' },
  { size: 'L', ukSize: '14', bust: '38', waist: '31', hips: '41' },
  { size: 'XL', ukSize: '16', bust: '40', waist: '33', hips: '43' },
  { size: 'XXL', ukSize: '18', bust: '42', waist: '35', hips: '45' },
]
export default async function SizeGuide() {
  const s = (await getSettings()) || {}
  const rows: any[] = s.sizeChart?.length ? s.sizeChart : DEFAULT
  return (<div className="wrap prose" style={{ maxWidth: 820, padding: '44px 20px' }}>
    <span className="kicker">House of QG</span>
    <h1 className="display" style={{ fontSize: 'clamp(38px,6vw,64px)', margin: '12px 0', lineHeight: 1, fontWeight: 400 }}>Size guide</h1>
    <p style={{ color: 'var(--mute)' }}>All measurements are <b>body</b> measurements in inches, not the garment. If you fall between two sizes, size up for a relaxed fit or message us on chat and we will help you choose.</p>
    <div style={{ overflowX: 'auto' }}><table className="sg"><thead><tr><th style={{ textAlign: 'left' }}>Size</th><th>UK</th><th>Bust</th><th>Waist</th><th>Hips</th></tr></thead>
      <tbody>{rows.map((r) => <tr key={r.size}><th>{r.size}</th><td>{r.ukSize || '–'}</td><td>{r.bust}"</td><td>{r.waist}"</td><td>{r.hips}"</td></tr>)}</tbody></table></div>
    <h3>How to measure</h3>
    <p><b>Bust.</b> Around the fullest part of your chest, keeping the tape level under your arms.</p>
    <p><b>Waist.</b> Around the narrowest part of your waist, usually just above your belly button.</p>
    <p><b>Hips.</b> Around the fullest part of your hips, about 8 inches below your waist.</p>
    {s.sizeGuideNote && <p>{s.sizeGuideNote}</p>}
    <p style={{ marginTop: 30 }}><Link href="/#shop" className="btn">Shop the collection</Link></p>
  </div>)
}
