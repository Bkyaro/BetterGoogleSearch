import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site -> https://<user>.github.io/BetterGoogleSearch/
export default defineConfig({
  base: '/BetterGoogleSearch/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
  },
})
