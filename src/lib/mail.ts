/**
 * Transactional email with automatic fallback.
 *   1. Resend (free plan: 100 emails/day, 3,000/month)
 *   2. Brevo  (free plan: 300 emails/day), used when Resend is out of quota or fails
 * Whichever provider is not configured is skipped. Never throws; returns true if any provider accepted the mail.
 */
type Mail = { to: string; subject: string; html?: string; text?: string }
const FROM = () => process.env.EMAIL_FROM || 'House of QG <orders@houseofqg.com>'
const REPLY_TO = () => process.env.EMAIL_REPLY_TO || process.env.OWNER_EMAIL || undefined

// If Resend says its quota is used up, skip it until the next UTC midnight (when the daily quota resets)
// so every email does not waste a failed request first. Resets automatically on cold starts too.
let resendPausedUntil = 0
const nextUtcMidnight = () => { const d = new Date(); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1) }

async function viaResend({ to, subject, html, text }: Mail) {
  if (!process.env.RESEND_API_KEY || Date.now() < resendPausedUntil) return false
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM(), to, subject, reply_to: REPLY_TO(), ...(html ? { html } : { text: text || subject }) }),
  }).catch((e) => { console.error('[mail] resend network error', e?.message); return null })
  if (r?.ok) return true
  if (r) {
    const body = await r.text().catch(() => '')
    console.error('[mail] resend failed', r.status, body.slice(0, 200))
    // 429 = rate/quota limit. Pause Resend for the rest of the UTC day only for the daily quota error.
    if (r.status === 429 && /quota/i.test(body)) resendPausedUntil = nextUtcMidnight()
  }
  return false
}

async function viaBrevo({ to, subject, html, text }: Mail) {
  if (!process.env.BREVO_API_KEY) return false
  const m = /^(.*)<(.+)>$/.exec(FROM()), name = (m?.[1] || 'House of QG').trim().replace(/^"|"$/g, ''), email = (m?.[2] || FROM()).trim()
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST', headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ sender: { name, email }, to: [{ email: to }], subject, ...(REPLY_TO() ? { replyTo: { email: REPLY_TO() } } : {}), ...(html ? { htmlContent: html } : { textContent: text || subject }) }),
  }).catch((e) => { console.error('[mail] brevo network error', e?.message); return null })
  if (r?.ok) return true
  if (r) console.error('[mail] brevo failed', r.status, (await r.text().catch(() => '')).slice(0, 200))
  return false
}

export async function sendMail(mail: Mail) {
  try { if (await viaResend(mail)) return true } catch (e: any) { console.error('[mail] resend threw', e?.message) }
  try { if (await viaBrevo(mail)) return true } catch (e: any) { console.error('[mail] brevo threw', e?.message) }
  return false
}
