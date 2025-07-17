import { Injectable, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { CardsApiService } from '../barn/cards-api.service';

@Injectable({ providedIn: 'root' })
export class CardsService {
  private cardsApiService = inject(CardsApiService);

  getUnsortedCards() {
    return rxResource({ stream: () => this.cardsApiService.getUnsortedCards() });
  }

  getCards({ lastCardsCount }: { lastCardsCount?: number } = {}) {
    return rxResource({ stream: () => this.cardsApiService.getCards({ lastCardsCount }) });
  }

  getCardsAmount() {
    return rxResource({ stream: () => this.cardsApiService.getCardsAmount() });
  }
}
