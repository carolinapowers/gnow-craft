import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import inspect from 'vite-plugin-inspect'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      // Enable Vue DevTools in all environments
    }),
    inspect()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
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
  base: '/'
})
