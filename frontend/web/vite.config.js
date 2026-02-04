import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.onegov\.nsw\.gov\.au\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'nsw-fuel-api-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 5 * 60 },
            },
          },
          {
            urlPattern: /^https:\/\/api\.allorigins\.win\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'wa-fuel-proxy-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 },
            },
          },
          {
            urlPattern: /^https:\/\/www\.data\.qld\.gov\.au\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'qld-fuel-api-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 6 * 60 * 60 },
            },
          },
          {
            urlPattern: /^https:\/\/www\.fuelcheck\.tas\.gov\.au\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tas-fuel-api-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 5 * 60 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/unpkg\.com\/leaflet.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'leaflet-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'map-tiles-cache',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
      manifest: {
        name: 'Berrima Diesel Touring Tools',
        short_name: 'Berrima Diesel',
        description: 'Diesel Price Tracker & Caravan Route Planner for 4WD, Motorhome & Camper Travellers - The Diesel Experts since 1956',
        theme_color: '#6B4423',
        background_color: '#FDF6E3',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/berrima-diesel-app/',
        scope: '/berrima-diesel-app/',
        categories: ['business', 'navigation', 'utilities'],
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'icon-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  base: '/berrima-diesel-app/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
