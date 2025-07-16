import { Injectable, inject } from '@angular/core';
import { from, map, switchMap } from 'rxjs';

import { BarnDbService } from './barn-db.service';

@Injectable({ providedIn: 'root' })
export class CardsApiService {
  private barnDbV2Service = inject(BarnDbService);

  getUnsortedCards() {
    return from(this.barnDbV2Service.getDb()).pipe(
      switchMap(db => db.sprouts.find({ selector: { definition: { $eq: '' } } }).$),
      map(cards => cards.map(card => card.toMutableJSON())),
    );
  }
}
