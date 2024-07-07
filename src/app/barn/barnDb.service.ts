import { InjectionToken, Injector, type Signal, untracked } from '@angular/core';
import { provideAsync } from '../utils/provideAsync';
import type { BarnDbCollections } from './rxdb/rxdb';
import type { RxDatabase, RxReactivityFactory } from 'rxdb';
import { toSignal } from '@angular/core/rxjs-interop';

export type BarnDb = RxDatabase<BarnDbCollections<Signal<unknown>>, unknown, unknown, Signal<unknown>>;

export const BarnDbService = new InjectionToken<BarnDb>('barnDb');

export const provideBarnDbAsync = () => {
  return provideAsync(BarnDbService, async (injector: Injector) => {
    const { createBarnDb } = await import('./rxdb/rxdb');

    return await createBarnDb({ reactivity: createReactivityFactory(injector) });
  });
};

// reactive types in `.$$` are wrong for now, use regular observables from `.$` instead
// https://github.com/pubkey/rxdb/issues/6188
export function createReactivityFactory(injector: Injector): RxReactivityFactory<Signal<unknown>> {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fromObservable(observable$, initialValue: any) {
      return untracked(() =>
        toSignal(observable$, {
          initialValue,
          injector,
          rejectErrors: true,
        }),
      );
    },
  };
}
