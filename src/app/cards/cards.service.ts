import { Injectable, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { nanoid } from 'nanoid';

import { CardsApiService, type GetCardsParams } from '../barn/cards-api.service';
import type { DbCard } from '../barn/rxdb/schema/cards';

@Injectable({ providedIn: 'root' })
export class CardsService {
  private cardsApiService = inject(CardsApiService);

  getUnsortedCards() {
    return rxResource({ stream: () => this.cardsApiService.getUnsortedCards() });
  }

  getCards(params?: () => GetCardsParams | undefined) {
    return rxResource({
      params,
      // NOTE: `params` field type is not correct here when `params` argument is `undefined`
      // it should be `GetCardsParams | null`, but it derives only `GetCardsParams` type despite having `null` value
      // unexpected `null` breaks `cardsApiService.getCards()` method
      // https://github.com/angular/angular/issues/62724
      stream: ({ params }) => this.cardsApiService.getCards(params ?? undefined),
    });
  }

  getCardsCount() {
    return rxResource({ stream: () => this.cardsApiService.getCardsCount() });
  }

  async addCards(cardsToAdd: NewCard[]) {
    const newCards = cardsToAdd
      // filter out duplicates
      .filter((card, index, self) => self.findIndex(anotherCard => anotherCard.term === card.term) === index)
      .map(
        (card, index) =>
          ({
            id: nanoid(),
            term: card.term,
            definition: card.definition ?? '',
            fullTerm: card.fullTerm ?? undefined,
            // add a unique timestamp to each card to avoid sorting conflicts later
            addedAt: new Date(Date.now() + index).toISOString(),
            tags: card.tags ?? [],
          }) satisfies DbCard,
      );

    if (newCards.length) {
      await this.cardsApiService.addCards(newCards);
    }
  }

  async updateCard(id: string, newData: Partial<DbCard>) {
    return this.cardsApiService.updateCard(id, newData);
  }

  async removeCard(id: string) {
    return this.cardsApiService.removeCard(id);
  }
}

export interface NewCard {
  term: string;
  fullTerm?: string;
  definition?: string;
  tags?: string[];
}
