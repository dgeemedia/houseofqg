'use client'
import { LEGAL } from '@/lib/legal'
export default function LegalView({ slug }: { slug: string }) {
  const d = LEGAL[slug]
  return (<div className="wrap prose" style={{ maxWidth: 760, padding: '40px 20px' }}><h1 className="display">{d.title}</h1><small>House of QG · houseofqg.com</small>
    {d.sections.map(([h, x]) => <section key={h}><h3>{h}</h3><p>{x}</p></section>)}</div>)
}
