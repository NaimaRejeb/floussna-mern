import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({ babel: { compact: true } })],
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: true,
      clientPort: 5173
    },
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  // Désactiver le cache pour le développement
  optimizeDeps: {
    force: true
  },
  // S'assurer que le cache est désactivé
  cacheDir: '.vite'
})
