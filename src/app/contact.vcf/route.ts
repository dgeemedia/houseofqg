import { getSettings } from '@/lib/sanity'
import { buildVCard } from '@/lib/vcard'
export const revalidate = 300
/** Opens "Add to contacts" on iPhone and Android: name, phone, WhatsApp, email, address, website and social links, with the logo as the photo. */
export async function GET() {
  const s = (await getSettings().catch(() => null)) || {}
  return new Response(buildVCard(s), { headers: { 'Content-Type': 'text/vcard; charset=utf-8', 'Content-Disposition': 'inline; filename="House-of-QG.vcf"', 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400' } })
}
