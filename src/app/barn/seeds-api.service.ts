import { Injectable, inject } from '@angular/core';
import { from, switchMap } from 'rxjs';

import { BarnDbService } from './barn-db.service';

@Injectable({ providedIn: 'root' })
export class SeedsApiService {
  private barnDbService = inject(BarnDbService);

  getSeedsAmount() {
    return from(this.barnDbService.getDb()).pipe(switchMap(db => db.seeds.count().$));
  }
}
