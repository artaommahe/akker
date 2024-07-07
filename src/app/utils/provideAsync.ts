import { APP_INITIALIZER, ApplicationInitStatus, inject, InjectionToken, Injector, type Provider } from '@angular/core';

// https://github.com/angular/angular/issues/23279#issuecomment-1165030809
export function provideAsync<T>(
  token: T | InjectionToken<T>,
  initializer: (injector: Injector) => Promise<T>,
): Provider[] {
  const container: { value?: T } = { value: undefined };

  return [
    {
      provide: APP_INITIALIZER,
      useFactory: (injector: Injector) => async () => {
        container.value = await initializer(injector);
      },
      deps: [Injector],
      multi: true,
    },
    {
      provide: token,
      useFactory: () => {
        if (!inject(ApplicationInitStatus).done) {
          throw new Error(`Cannot inject ${token} until bootstrap is complete.`);
        }
        return container.value;
      },
    },
  ];
}
