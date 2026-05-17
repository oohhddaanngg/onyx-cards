import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020',
    lib: {
      entry: resolve(import.meta.dirname, 'src/onyx-cards.ts'),
      formats: ['es'],
      fileName: () => 'onyx-cards.js',
    },
    rollupOptions: {
      output: {
        codeSplitting: false,
      },
    },
  },
});
