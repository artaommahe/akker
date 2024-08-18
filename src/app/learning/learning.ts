import { Injectable } from '@angular/core';
import { type Card, State, createEmptyCard, fsrs } from 'ts-fsrs';

import type { DbSprout } from '../barn/rxdb/schema/sprouts';
import type { CardGrade } from './cards/cards.component';

@Injectable({ providedIn: 'root' })
export class LearningService {
  private f = fsrs();

  // TODO: add tests
  selectCardsToLearn<T extends { id: string; fsrs?: DbSprout['fsrs'] }>(cards: T[], limit: number): T[] {
    let { newCards, learning, review } = cards.reduce(
      (acc, card) => {
        const type =
          card.fsrs?.card.state === State.New
            ? 'newCards'
            : card.fsrs?.card.state === State.Review
              ? 'review'
              : 'learning';

        return { ...acc, [type]: [...acc[type], card] };
      },
      { newCards: [] as T[], learning: [] as T[], review: [] as T[] },
    );

    newCards = newCards.toSorted(() => Math.random() - 0.5);
    learning = learning.toSorted((a, b) => a.fsrs?.card.due.localeCompare(b.fsrs?.card.due ?? '') ?? 0);
    review = review
      .filter(card => (card.fsrs?.card.due.localeCompare(new Date().toISOString()) ?? 0) <= 0)
      .toSorted((a, b) => a.fsrs?.card.due.localeCompare(b.fsrs?.card.due ?? '') ?? 0);

    return [...newCards, ...learning, ...review].slice(0, limit);
  }

  rateCard({ card, grade }: { card?: NonNullable<DbSprout['fsrs']>['card']; grade: CardGrade }) {
    const fsrsCard = card ? convertDbCardToFsrsCard(card) : createEmptyCard<Card>(new Date());

    const recordLog = this.f.repeat(fsrsCard, fsrsCard.due);
    const newCard = recordLog[grade].card;

    return convertFsrsCardToDbCard(newCard);
  }
}

const convertDbCardToFsrsCard = (card: NonNullable<DbSprout['fsrs']>['card']): Card => ({
  ...card,
  due: new Date(card.due),
  last_review: card.last_review ? new Date(card.last_review) : undefined,
});

const convertFsrsCardToDbCard = (card: Card): NonNullable<DbSprout['fsrs']>['card'] => ({
  ...card,
  due: card.due.toISOString(),
  last_review: card.last_review?.toISOString(),
});
