import {
  ApplicationInitStatus,
  type EnvironmentProviders,
  InjectionToken,
  Injector,
  type Provider,
  inject,
  provideAppInitializer,
} from '@angular/core';

// https://github.com/angular/angular/issues/23279#issuecomment-1165030809
export function provideAsync<T>(
  token: T | InjectionToken<T>,
  initializer: (injector: Injector) => Promise<T>,
): (Provider | EnvironmentProviders)[] {
  const container: { value?: T } = { value: undefined };

  return [
    provideAppInitializer(async () => {
      const injector = inject(Injector);
      container.value = await initializer(injector);
    }),
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
