import { InjectionToken, Optional, Provider, SkipSelf, inject } from '@angular/core';

type Icons = Record<string, string>;

const iconsToken = new InjectionToken<Icons[]>('icon');

export const provideIcons = (icons: Icons) =>
  ({
    provide: iconsToken,
    useFactory: (parentIcons?: Icons[]) => ({
      ...parentIcons?.reduce((acc, icons) => ({ ...acc, ...icons }), {} as Icons),
      ...icons,
    }),
    deps: [[iconsToken, new Optional(), new SkipSelf()]],
    multi: true,
  }) satisfies Provider;

export const injectIcons = () => inject(iconsToken, { optional: true }) ?? ([] as Icons[]);
