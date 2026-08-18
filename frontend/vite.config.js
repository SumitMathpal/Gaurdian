import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    port: 5173,

    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },

      '/auth': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },

      '/find-person': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },

      '/missing-persons': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    }
  }
})