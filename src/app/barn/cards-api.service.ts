import { Injectable, inject } from '@angular/core';
import { from, map, switchMap } from 'rxjs';

import { BarnDbService } from './barn-db.service';

@Injectable({ providedIn: 'root' })
export class CardsApiService {
  private barnDbService = inject(BarnDbService);

  getUnsortedCards() {
    return from(this.barnDbService.getDb()).pipe(
      switchMap(db => db.sprouts.find({ selector: { definition: { $eq: '' } } }).$),
      map(cards => cards.map(card => card.toMutableJSON())),
    );
  }

  getCards({ lastCardsCount }: { lastCardsCount?: number } = {}) {
    return from(this.barnDbService.getDb()).pipe(
      switchMap(db => db.sprouts.find({ sort: [{ addedAt: 'desc' }], limit: lastCardsCount }).$),
      map(cards => cards.map(card => card.toMutableJSON())),
    );
  }

  getCardsAmount() {
    return from(this.barnDbService.getDb()).pipe(switchMap(db => db.sprouts.count().$));
  }
}
