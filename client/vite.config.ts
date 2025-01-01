import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base:'/',
  server: {
    port: 3000, // Port for local development
  },
  build: {
    outDir: 'dist', // Specify the output directory for production files
    sourcemap: false, // Enable source maps if needed for debugging (false for production)
    target: 'esnext', // Specify the target environment (esnext for modern browsers)
    minify: 'esbuild', // Minify the production build (can switch to 'terser' for better optimization)
    chunkSizeWarningLimit: 500, // Set chunk size limit (default is 500 KB)
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'; // Bundle dependencies separately from the app code
          }
        },
      },
    },
  },
  plugins: [react()],
})
