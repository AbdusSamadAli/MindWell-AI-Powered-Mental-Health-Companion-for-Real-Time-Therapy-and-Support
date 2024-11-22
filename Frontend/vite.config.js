import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Define Vite config
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../Frontend/dist',
    emptyOutDir: true, 
  },
  server: {
    port: 5173, 
  },
});

