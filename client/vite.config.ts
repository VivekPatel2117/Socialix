import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    port: 3000,
  },
  build: {
    outDir: 'dist', // Specify the output directory for production files
    sourcemap: false, // Enable source maps if needed for debugging
    target: 'esnext', // Specify the target environment
  },
  plugins: [react()],
})
