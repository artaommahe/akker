import { Injectable, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { CardsApiService } from '../barn/cards-api.service';
import type { DbCard } from '../barn/rxdb/schema/cards';

@Injectable({ providedIn: 'root' })
export class CardsService {
  private cardsApiService = inject(CardsApiService);

  getUnsortedCards() {
    return rxResource({ stream: () => this.cardsApiService.getUnsortedCards() });
  }

  getCards({ limit }: { limit?: number } = {}) {
    return rxResource({ stream: () => this.cardsApiService.getCards({ limit }) });
  }

  getCardsCount() {
    return rxResource({ stream: () => this.cardsApiService.getCardsCount() });
  }

  async updateCard(id: string, newData: Partial<DbCard>) {
    return this.cardsApiService.updateCard(id, newData);
  }

  async removeCard(id: string) {
    return this.cardsApiService.removeCard(id);
  }
}
