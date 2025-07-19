import { Injectable, inject } from '@angular/core';
import { from, map, switchMap } from 'rxjs';

import { BarnDbService } from './barn-db.service';
import type { DbSeed } from './rxdb/schema/seeds';

@Injectable({ providedIn: 'root' })
export class SeedsApiService {
  private barnDbService = inject(BarnDbService);

  getSeeds({ limit }: { limit?: number } = {}) {
    return from(this.barnDbService.getDb()).pipe(
      switchMap(db => db.seeds.find({ sort: [{ lastAddedAt: 'desc' }], limit }).$),
      map(seeds => seeds.map(seed => seed.toMutableJSON())),
    );
  }

  getSeedsCount() {
    return from(this.barnDbService.getDb()).pipe(switchMap(db => db.seeds.count().$));
  }

  async updateSeed(name: string, newData: Partial<DbSeed>) {
    const db = await this.barnDbService.getDb();

    await db.seeds.findOne({ selector: { name } }).modify(seed => ({ ...seed, ...newData }));
  }

  async removeSeeds(names: string[]) {
    const db = await this.barnDbService.getDb();

    await db.seeds.find({ selector: { name: { $in: names } } }).remove();
  }
}
