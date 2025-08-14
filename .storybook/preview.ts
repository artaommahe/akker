import { setCompodocJson } from '@storybook/addon-docs/angular';
import { type Preview, applicationConfig } from '@storybook/angular';

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
  },
  initialGlobals: {
    backgrounds: { value: 'dark' },
  },
};

export default preview;
