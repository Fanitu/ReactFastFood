import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['react-map-gl']
  },
  test: {
    environment: 'jsdom',
    setupFiles: [],
    coverage: {
      provider: 'v8'
    }
  }
})
