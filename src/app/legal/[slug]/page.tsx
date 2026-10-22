import { notFound } from 'next/navigation'
import { LEGAL } from '@/lib/legal'
import LegalView from '@/components/LegalView'
export const generateStaticParams = () => Object.keys(LEGAL).map((slug) => ({ slug }))
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return { title: LEGAL[slug]?.title || 'Legal', description: `${LEGAL[slug]?.title || 'Policy'} for House of QG, an online fashion store delivering across Nigeria.`, alternates: { canonical: `/legal/${slug}` } } }
export default async function Legal({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!LEGAL[slug]) notFound()
  return <LegalView slug={slug} />
}
