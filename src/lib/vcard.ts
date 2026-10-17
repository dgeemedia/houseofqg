import { LOGO_PNG_B64 } from './logoData'
import { DEFAULT_ADDRESS } from './site'
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://houseofqg.com'
/** 0803 123 4567 -> +2348031234567. Numbers already in +international form are kept. */
export function e164(raw?: string) {
  if (!raw) return ''
  const t = raw.trim(), d = t.replace(/\D/g, '')
  if (t.startsWith('+')) return '+' + d
  if (d.startsWith('234')) return '+' + d
  if (d.startsWith('0') && d.length === 11) return '+234' + d.slice(1)
  if (d.length === 10) return '+234' + d
  return d ? '+' + d : ''
}
const esc = (v: string) => v.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
/** vCard lines are folded at 75 characters, continuation lines start with a space. */
const fold = (l: string) => { const out: string[] = []; let s = l; while (s.length > 75) { out.push(s.slice(0, 75)); s = ' ' + s.slice(75) } out.push(s); return out.join('\r\n') }
export type ContactLink = { label: string; url: string }
/** Every link the card carries, in display order. Empty settings fields are skipped. */
export function contactLinks(s: any): ContactLink[] {
  const wa = (s?.whatsappNumber || '').replace(/\D/g, '')
  return ([['Website', SITE], ['Instagram', s?.instagramUrl], ['TikTok', s?.tiktokUrl], ['Facebook', s?.facebookUrl], ['X', s?.xUrl], ['YouTube', s?.youtubeUrl], ['LinkedIn', s?.linkedinUrl], ['Snapchat', s?.snapchatUrl], ['Pinterest', s?.pinterestUrl], ['Threads', s?.threadsUrl], ['Telegram', s?.telegramUrl], ['WhatsApp', wa && `https://wa.me/${wa}`]] as [string, string][])
    .filter(([, u]) => u).map(([label, url]) => ({ label, url }))
}
export function buildVCard(s: any, opts: { photo?: boolean } = {}) {
  const phone = e164(s?.phone), wa = e164(s?.whatsappNumber)
  const L: string[] = ['BEGIN:VCARD', 'VERSION:3.0', 'N:QG;House of;;;', 'FN:House of QG', 'ORG:House of QG', 'TITLE:Fashion • Style • You']
  if (phone) L.push(`TEL;TYPE=WORK,VOICE,pref:${phone}`)
  if (wa && wa !== phone) L.push(`TEL;TYPE=CELL:${wa}`)
  if (s?.email) L.push(`EMAIL;TYPE=INTERNET,WORK:${esc(s.email)}`)
  if (s?.address) L.push(`ADR;TYPE=WORK:;;${esc(String(s.address))};;;;`)
  else L.push(`ADR;TYPE=WORK:;;${esc(DEFAULT_ADDRESS.street)};${DEFAULT_ADDRESS.locality};${DEFAULT_ADDRESS.region};;${DEFAULT_ADDRESS.country}`)
  contactLinks(s).forEach((l, i) => { L.push(i === 0 ? `URL:${l.url}` : `item${i}.URL:${l.url}`); if (i > 0) L.push(`item${i}.X-ABLabel:${l.label}`) })
  L.push('NOTE:Clothing with a point of view. Fastest Finger drops and Black Friday sales at houseofqg.com.')
  if (opts.photo !== false) L.push(`PHOTO;ENCODING=b;TYPE=PNG:${LOGO_PNG_B64}`)
  L.push('END:VCARD')
  return L.map(fold).join('\r\n') + '\r\n'
}
