import { type ApplicationConfig, ErrorHandler, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideBarnDbAsync } from './barn/barnDb.service';
import { createErrorHandler } from '@sentry/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideBarnDbAsync(),
    {
      provide: ErrorHandler,
      useValue: createErrorHandler({ showDialog: false }),
    },
  ],
};
