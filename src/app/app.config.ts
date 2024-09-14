import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { type ApplicationConfig, ErrorHandler, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { createErrorHandler } from '@sentry/angular';

import { routes } from './app.routes';
import { provideBarnDbAsync } from './barn/barnDb.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideBarnDbAsync(),
    {
      provide: ErrorHandler,
      useValue: createErrorHandler({ showDialog: false }),
    },
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { dateFormat: 'MMM d, y, HH:mm:ss' } },
  ],
};
