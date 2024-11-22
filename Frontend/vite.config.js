import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../Backend/dist', // Builds go into Backend/dist
    emptyOutDir: true, // Cleans the dist folder before each build
  },
  base: './', // Ensures relative asset paths for deployment
  server: {
    port: 5173, // Vite dev server port
    proxy: {
      '/api': 'http://localhost:8080', // Proxy API calls to the backend
    },
  },
});


