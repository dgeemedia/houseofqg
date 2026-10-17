'use client'
import { useEffect, useState } from 'react'
/** Slim install bar under the header (in the page flow, so it never covers the chat button). */
export default function PWA() {
  const [evt, setEvt] = useState<any>(null), [ios, setIos] = useState(false), [hide, setHide] = useState(true)
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') navigator.serviceWorker.register('/sw.js').catch(() => {})
    const installed = matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone
    if (installed || localStorage.getItem('qg-pwa-dismissed')) return
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) { setIos(true); setHide(false) }
    const h = (e: any) => { e.preventDefault(); setEvt(e); setHide(false) }
    window.addEventListener('beforeinstallprompt', h)
    return () => window.removeEventListener('beforeinstallprompt', h)
  }, [])
  if (hide || (!evt && !ios)) return null
  return (<div className="pwabar">
    <img src="/icon-192.png" width={32} height={32} alt="" />
    <span><b>Add House of QG to your home screen</b> {ios ? 'Tap Share, then "Add to Home Screen".' : 'to catch Fastest Finger drops faster.'}</span>
    {evt && <button className="btn" onClick={async () => { evt.prompt(); await evt.userChoice; setHide(true) }}>Install</button>}
    <button onClick={() => { localStorage.setItem('qg-pwa-dismissed', '1'); setHide(true) }} aria-label="Dismiss" style={{ background: 'none', border: 0, color: 'var(--mute)', fontSize: 22, cursor: 'pointer' }}>×</button>
  </div>)
}
