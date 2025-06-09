import { baseEnvironment } from './environment.base';

export const environment = {
  ...baseEnvironment,
  sentry: {
    dsn: 'https://8581fd3433617ae927dc974836ef34d8@o4507718881837056.ingest.de.sentry.io/4507718884458576',
  },
} satisfies typeof baseEnvironment;
