import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        hmr: false,
      },
      plugins: [
        react(), 
        tailwindcss(),
        VitePWA({
          registerType: 'prompt',
          includeAssets: [
            'favicon.ico',
            'apple-touch-icon.png',
            'icons/icon.svg',
            'icons/icon-192.png',
            'icons/icon-512.png',
            'icons/icon-512-maskable.png',
            'icons/favicon.png'
          ],
          manifest: {
            id: '/',
            name: 'Hoomty',
            short_name: 'Hoomty',
            description: 'Hoomty - Mon quartier. Votre plateforme de proximité pour tous les commerces de quartier algériens.',
            theme_color: '#10B981',
            background_color: '#FFFFFF',
            display: 'standalone',
            orientation: 'portrait-primary',
            start_url: '/',
            scope: '/',
            lang: 'fr',
            dir: 'ltr',
            categories: ['shopping', 'food', 'lifestyle'],
            icons: [
              {
                src: '/icons/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any'
              },
              {
                src: '/icons/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
              },
              {
                src: '/icons/icon-512-maskable.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
              }
            ],
            shortcuts: [
              {
                name: 'Boutiques & Commerces',
                short_name: 'Boutiques',
                description: 'Explorer les commerces de votre quartier',
                url: '/stores',
                icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }]
              },
              {
                name: 'Mon Panier',
                short_name: 'Panier',
                description: 'Accéder à votre panier',
                url: '/cart',
                icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }]
              },
              {
                name: 'Espace Houma',
                short_name: 'Houma',
                description: 'Actualités et services de quartier',
                url: '/houma',
                icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }]
              },
              {
                name: 'Fidélité & Points',
                short_name: 'Fidélité',
                description: 'Consulter vos points et récompenses',
                url: '/fidelity',
                icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }]
              }
            ]
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
            navigateFallback: '/index.html',
            navigateFallbackDenylist: [/^\/api\//],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              },
              {
                urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'gstatic-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              },
              {
                urlPattern: /^https:\/\/unpkg\.com\/leaflet.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'leaflet-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 30
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              },
              {
                urlPattern: /\/api\/.*/i,
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'api-cache',
                  networkTimeoutSeconds: 3,
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              },
              {
                urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
                handler: 'StaleWhileRevalidate',
                options: {
                  cacheName: 'unsplash-images-cache',
                  expiration: {
                    maxEntries: 60,
                    maxAgeSeconds: 60 * 60 * 24 * 30
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              }
            ]
          },
          devOptions: {
            enabled: false,
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
