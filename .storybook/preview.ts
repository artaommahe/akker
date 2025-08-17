import { setCompodocJson } from '@storybook/addon-docs/angular';
import { type Preview, applicationConfig } from '@storybook/angular';
// NOTE: hack to avoid `NG0908: In this configuration Angular requires Zone.js` error
// when running storybook tests
import 'zone.js';

import docJson from '../documentation.json';
import { appConfig } from '../src/app/app.config';
import '../src/styles.css';

setCompodocJson(docJson);

const preview: Preview = {
  decorators: [applicationConfig(appConfig)],
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
