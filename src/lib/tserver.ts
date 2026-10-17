import { D } from './dict'
export type Lng = 'en'
export const normLang = (_x?: any): Lng => 'en'
/** Server-side copy (emails, SMS, PDFs). Same dictionary as the website. */
export function ts(_lang: any, key: string, vars?: Record<string, any>) {
  let s = D[key] ?? key
  if (vars) for (const k in vars) s = s.split(`{${k}}`).join(String(vars[k]))
  return s
}
