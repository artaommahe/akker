import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { init } from '@sentry/angular';
import { environment } from './environments/environment';

init({
  enabled: !!environment.sentry.dsn,
  dsn: environment.sentry.dsn,
  integrations: [],
});

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
