import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Define Vite config
export default defineConfig({
  plugins: [react()],
  build: {
    // Adjust the output directory if needed
    outDir: '../Backend/dist', // Ensures built files go to Backend/dist
    emptyOutDir: true, // Ensures the output directory is cleaned before each build
  },
  server: {
    port: 5173, // Keeps the Vite dev server running on port 517
  },
});

