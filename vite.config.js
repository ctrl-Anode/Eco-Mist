import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx' // Import the vueJsx plugin
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    tailwindcss()
  ],
  esbuild: {
  },
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        sw: "./public/firebase-messaging-sw.js", // Ensure service worker is included
      },
    },
  },
})