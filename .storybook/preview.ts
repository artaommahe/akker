import { setCompodocJson } from '@storybook/addon-docs/angular';
import { type Preview } from '@storybook/angular';

import docJson from '../documentation.json';

import '../src/styles.css';

setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: '#313231' },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'error',
    },
  },
  initialGlobals: {
    backgrounds: { value: 'dark' },
  },
};

export default preview;
