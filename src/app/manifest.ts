import type { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'House of QG', short_name: 'House of QG', description: 'Fashion, Fastest Finger drops and Black Friday sales from House of QG.',
    start_url: '/', scope: '/', display: 'standalone', background_color: '#f5efe6', theme_color: '#f5efe6',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [{ name: 'Fastest Finger', url: '/#drop' }, { name: 'Track order', url: '/track' }, { name: 'Size guide', url: '/size-guide' }],
  }
}
