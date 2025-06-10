import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts'; // Plugin to generate .d.ts files
import path from 'node:path'
export default defineConfig({
  plugins:[
    dts({
      insertTypesEntry: true,
      outDir: 'dist/types',
    }),

  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // Define @ as src directory
    }
  },
  build: {
    cssCodeSplit: true,
    lib: {
      entry: './src/index.ts', 
      name: 'devkit-config', 
      fileName: (format) => `index.${format}.js`, 
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'tailwindcss',
        'tailwindcss-primeui',
      ],
    },
  },
});
