import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['assets/images/tetrin.ico'],
      manifest: {
        name: 'Tetrin',
        short_name: 'Tetrin',
        description: 'Awesome block puzzle game!',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'assets/images/tetrin-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'assets/images/tetrin-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})