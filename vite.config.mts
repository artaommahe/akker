/// <reference types="vitest" />
/// <reference types="@vitest/browser/providers/playwright" />
import angular from '@analogjs/vite-plugin-angular';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [angular(), tsconfigPaths()],
    test: {
      reporters: ['default'],
      pool: 'threads',
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            globals: true,
            setupFiles: ['src/test-setup.ts'],
            include: ['src/**/*.spec.ts'],
            browser: {
              enabled: true,
              provider: 'playwright',
              headless: true,
              instances: [{ browser: 'chromium' }],
              screenshotFailures: false,
            },
          },
        },
        {
          extends: true,
          plugins: [
            storybookTest({
              configDir: path.join(dirname, '.storybook'),
            }),
          ],
          test: {
            name: 'storybook',
            setupFiles: ['./.storybook/vitest.setup.ts'],
            browser: {
              enabled: true,
              provider: 'playwright',
              headless: true,
              instances: [{ browser: 'chromium' }],
            },
          },
        },
      ],
    },
    define: { 'import.meta.vitest': mode !== 'production' },
  };
});
