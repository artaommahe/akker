import { Injectable, Injector, type Signal, inject, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import type { RxDatabase, RxReactivityFactory } from 'rxdb';

import type { BarnDbCollections } from './rxdb/rxdb';

@Injectable({ providedIn: 'root' })
export class BarnDbService {
  private injector = inject(Injector);
  private dbPromise: Promise<BarnDb> | undefined;

  async getDb() {
    if (!this.dbPromise) {
      this.dbPromise = new Promise<BarnDb>(resolve => {
        import('./rxdb/rxdb')
          .then(({ createBarnDb }) => createBarnDb({ reactivity: createReactivityFactory(this.injector) }))
          .then(resolve);
      });
    }

    return this.dbPromise;
  }
}

export type BarnDb = RxDatabase<BarnDbCollections<Signal<unknown>>, unknown, unknown, Signal<unknown>>;

// reactive types in `.$$` are wrong for now, use regular observables from `.$` instead
// https://github.com/pubkey/rxdb/issues/6188
function createReactivityFactory(injector: Injector): RxReactivityFactory<Signal<unknown>> {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fromObservable(observable$, initialValue: any) {
      return untracked(() =>
        toSignal(observable$, {
          initialValue,
          injector,
        }),
      );
    },
  };
}
