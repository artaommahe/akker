import { Injectable } from '@angular/core';
import type { RxDatabase } from 'rxdb';

import type { BarnDbCollections } from './rxdb/rxdb';

@Injectable({ providedIn: 'root' })
export class BarnDbService {
  private dbPromise: Promise<BarnDb> | undefined;

  async getDb() {
    if (!this.dbPromise) {
      this.dbPromise = new Promise<BarnDb>(resolve => {
        import('./rxdb/rxdb').then(({ createBarnDb }) => createBarnDb()).then(resolve);
      });
    }

    return this.dbPromise;
  }
}

export type BarnDb = RxDatabase<BarnDbCollections>;
