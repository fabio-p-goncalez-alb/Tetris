import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false
      },
      includeAssets: [
        'assets/audios/bgm.ogg',
        'assets/audios/blockConfirm.ogg',
        'assets/audios/combo.ogg',
        'assets/audios/combo4.ogg',
        'assets/images/GameFrame.svg',
        'assets/images/HowToPlay.svg'
      ],
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