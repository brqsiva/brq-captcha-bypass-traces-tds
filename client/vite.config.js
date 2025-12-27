// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['express'] // Prevent Express from being bundled
    }
  },
  ssr: {
    noExternal: ['express'] // If using SSR, keep this
  }
})