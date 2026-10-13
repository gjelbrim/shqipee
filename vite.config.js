import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'
import { PAGE_META, renderHead } from './src/utils/pageMeta.js'

// writes <script>.html (vithkuqi.html, todhri.html) next to index.html with that page's
// title, description, canonical and Open Graph tags, for link previews and crawlers that
// don't run JavaScript; vercel.json rewrites /vithkuqi and /todhri to them
/** @returns {import('vite').Plugin} */
const pageHeads = () => ({
  name: 'page-heads',
  apply: 'build',
  enforce: 'post',
  generateBundle(_, bundle) {
    const index = bundle['index.html']
    if (index?.type !== 'asset') throw new Error('index.html missing from the bundle')
    for (const meta of Object.values(PAGE_META)) {
      if (meta.path === '/') continue
      this.emitFile({ type: 'asset', fileName: `${meta.path.slice(1)}.html`, source: renderHead(String(index.source), meta) })
    }
  }
})

const description = 'Transliterate Albanian Latin text into the historical Elbasan, Vithkuqi and Todhri scripts and back.'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    pageHeads(),
    // installable app that works offline: the service worker precaches the whole build
    // (all fonts included, so every script renders offline) and updates itself silently;
    // a new version is used from the next start
    VitePWA({
      registerType: 'autoUpdate',
      // the icons are already in globPatterns
      includeManifestIcons: false,
      manifest: {
        name: 'shqip.ee',
        short_name: 'shqip.ee',
        description,
        lang: 'en',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#DBE1D5',
        background_color: '#DBE1D5',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        // long press / right click on the app icon
        shortcuts: [
          { name: 'Elbasan', url: '/', icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }] },
          { name: 'Vithkuqi', url: '/vithkuqi', icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }] },
          { name: 'Todhri', url: '/todhri', icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }] }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // only for link previews
        globIgnores: ['og-image.png'],
        // client-side routes (/vithkuqi, /todhri) are served by index.html, like the
        // rewrite in vercel.json; Vercel Analytics and the files for crawlers
        // (robots.txt, llms.txt, sitemap.xml) stay network-only
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/_vercel\//, /\.(txt|xml)$/]
      }
    })
  ],
  server: {
    historyApiFallback: true
  }
})
