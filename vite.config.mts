/// <reference types="vitest" />
import angular from '@analogjs/vite-plugin-angular';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
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
              provider: playwright(),
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
          // for some reasons running these tests right after installing libs fails with an error
          // > Error: Failed to import test file node_modules/@storybook/addon-vitest/dist/vitest-plugin/setup-file.mjs
          // > Caused by: Error: Vitest failed to find the runner. This is a bug in Vitest. Please, open an issue with reproduction.
          // looks like adding `@storybook/angular/dist/client/index.mjs` to `optimizeDeps` fixes the issue :/
          // https://github.com/vitest-dev/vitest/issues/8471
          optimizeDeps: {
            include: ['@storybook/angular/dist/client/index.mjs'],
          },
          test: {
            name: 'storybook',
            setupFiles: ['./.storybook/vitest.setup.ts'],
            browser: {
              enabled: true,
              provider: playwright(),
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
