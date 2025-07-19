import { Injectable, inject } from '@angular/core';
import type { RxDumpDatabaseAny } from 'rxdb';

import { BarnDbService } from './barn-db.service';
import type { BarnDbCollections } from './rxdb/rxdb';

@Injectable({ providedIn: 'root' })
export class SyncApiService {
  private barnDbService = inject(BarnDbService);

  async export() {
    const db = await this.barnDbService.getDb();

    return await db.exportJSON();
  }

  async import(data: RxDumpDatabaseAny<BarnDbCollections>) {
    const db = await this.barnDbService.getDb();

    await db.importJSON(data);
  }
}
