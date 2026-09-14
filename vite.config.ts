import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  // Set base path for GitHub Pages when building for production
  base: mode === 'production' ? '/studycompanion/' : '/',
  plugins: [react()],
}))
