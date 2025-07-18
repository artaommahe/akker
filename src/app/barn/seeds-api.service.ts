import { Injectable, inject } from '@angular/core';
import { from, map, switchMap } from 'rxjs';

import { BarnDbService } from './barn-db.service';

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
}
