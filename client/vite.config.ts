import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // Set base path for production (if serving from a subdirectory, change this)
  server: {
    port: 3000, // Port for local development
    open: true, // Open browser automatically
    hmr: true, // Enable hot module replacement
    watch: {
      usePolling: true, // Enable polling for file changes (useful in certain environments)
    },
  },
  build: {
    outDir: 'dist', // Specify the output directory for production files
    sourcemap: true, // Enable sourcemaps for debugging production code
    target: 'esnext', // Specify target environment for modern browsers
    minify: 'esbuild', // Minify using esbuild (or switch to 'terser' for better optimization)
    chunkSizeWarningLimit: 1024, // Increase chunk size limit to 1MB to avoid warnings
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react';
            if (id.includes('react-router-dom')) return 'react-router';
            return 'vendor';
          }
        },
      },
    },
  },
  plugins: [react()],
});
