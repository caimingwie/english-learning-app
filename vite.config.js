import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/english-learning-app/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-192.svg'],
      manifest: {
        name: '英语学习助手',
        short_name: '英语学习',
        description: 'AI 驱动的智能英语学习应用 — 艾宾浩斯记忆法 + 个性化推荐',
        theme_color: '#f0f2f5',
        background_color: '#f0f2f5',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/english-learning-app/',
        scope: '/english-learning-app/',
        icons: [
          { src: '/english-learning-app/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/english-learning-app/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
        globIgnores: ['**/sw.js', '**/workbox-*.js'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 3000
  }
});
