import type { StorybookConfig } from '@analogjs/storybook-angular';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: {
    name: '@analogjs/storybook-angular',
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      define: {
        /* 'process.env': {}, */
        /* 'process.env.FORCE_TTY': false, */
        /* 'process.argv': process.argv ?? {}, */
      },
    });
  },
};

export default config;
