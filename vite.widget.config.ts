import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Widget standalone bundle build
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'dist-widget',
    lib: {
      entry: path.resolve(__dirname, 'src/widget.tsx'),
      name: 'NFSULibraryAssistantWidget',
      fileName: () => 'nfsu-library-widget.js',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
});
