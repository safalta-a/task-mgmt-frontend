import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import svgLoader from 'vite-svg-loader'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Pages({
      dirs: ['./src/pages']
    }),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },
    }),
    svgLoader({
      svgoConfig: {
        multipass: true,
      },
    }),
  ],
  define: { 'process.env': {} },
})
