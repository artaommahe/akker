import { Injectable, inject } from '@angular/core';
import { from, map, switchMap } from 'rxjs';

import { BarnDbService } from './barn-db.service';
import type { DbSeed } from './rxdb/schema/seeds';

@Injectable({ providedIn: 'root' })
export class SeedsApiService {
  private barnDbService = inject(BarnDbService);

  getSeeds({ limit, names }: { limit?: number; names?: string[] } = {}) {
    return from(this.barnDbService.getDb()).pipe(
      switchMap(
        db =>
          db.seeds.find({
            ...(names ? { selector: { name: { $in: names } } } : {}),
            sort: [{ lastAddedAt: 'desc' }],
            limit,
          }).$,
      ),
      map(seeds => seeds.map(seed => seed.toMutableJSON())),
    );
  }

  getSeedsCount() {
    return from(this.barnDbService.getDb()).pipe(switchMap(db => db.seeds.count().$));
  }

  async addSeeds(seeds: DbSeed[]) {
    const db = await this.barnDbService.getDb();

    await db.seeds.bulkUpsert(seeds);
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
