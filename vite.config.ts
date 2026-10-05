import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // react + gsap + framer-motion juntos passam um pouco de 500 kB (≈180 kB gzip)
  build: { chunkSizeWarningLimit: 700 },
})
