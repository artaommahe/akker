/// <reference types="vitest" />
import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [angular()],
    test: {
      globals: true,
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
      pool: 'threads',
      browser: {
        enabled: true,
        provider: 'playwright',
        name: 'chromium',
        headless: true,
      },
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
