'use client'
import { createContext, useContext } from 'react'
import { D, Lang } from './dict'
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string, v?: Record<string, any>) => string; tr: (prefix: string, v: string) => string; te: (msg: string) => string }
/** House of QG is English-only. The same t() / <T /> helpers are kept so every piece of copy lives in src/lib/dict.ts. */
const t = (k: string, v?: Record<string, any>) => { let s = D[k] ?? k; if (v) for (const n in v) s = s.split(`{${n}}`).join(String(v[n])); return s }
const value: Ctx = { lang: 'en', setLang: () => {}, t, tr: (prefix, v) => (D[prefix + v] ? t(prefix + v) : v), te: (m) => m }
const C = createContext<Ctx>(value)
export function LangProvider({ children }: { children: React.ReactNode }) { return <C.Provider value={value}>{children}</C.Provider> }
export const useLang = () => useContext(C)
/** Copy that can be dropped into server-rendered pages. */
export function T({ k, vars }: { k: string; vars?: Record<string, any> }) { return <>{t(k, vars)}</> }
/** Studio content (English only). Kept so product pages read the same way as before. */
export function L({ en }: { en?: string; zh?: string; fr?: string }) { return <>{en}</> }
export const loc = (p: any, f: 'name' | 'description', _lang?: Lang) => p[f]
export function LegalNote() { return null }
