import { type Preview, applicationConfig } from '@storybook/angular';

import { appConfig } from '../src/app/app.config';
import '../src/styles.css';

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
