import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      // Enable Vue DevTools in all environments
    }),
    inspect()
  ],
  css: {
    postcss: './postcss.config.js'
  },
  define: {
    // Enable Vue DevTools in production
    __VUE_PROD_DEVTOOLS__: true
  },
  build: {
    sourcemap: true
  },
  base: process.env.NODE_ENV === 'production' ? '/gnow-craft/' : '/'
})
