import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // ✅ Tell Vue to ignore <lord-icon> as a native custom element
          isCustomElement: (tag) => tag === 'lord-icon'
        }
      }
    }),
    tailwindcss(),
    vueJsx()
  ],
  esbuild: {},
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        sw: './public/firebase-messaging-sw.js', // Service worker support
      },
    },
  },
})
