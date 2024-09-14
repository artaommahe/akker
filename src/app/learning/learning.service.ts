import { Injectable } from '@angular/core';
import { type Card, State, createEmptyCard, fsrs } from 'ts-fsrs';

import type { DbSprout } from '../barn/rxdb/schema/sprouts';

@Injectable({ providedIn: 'root' })
export class LearningService {
  private f = fsrs();

  // TODO: add tests
  selectCardsToLearn<T extends { id: string; fsrs?: DbSprout['fsrs'] }>(cards: T[], limit: number): T[] {
    const { newCards, learning, review } = cards.reduce(
      (acc, card) => {
        const type =
          card.fsrs?.card.state === undefined || card.fsrs.card.state === State.New
            ? 'newCards'
            : card.fsrs.card.state === State.Review
              ? 'review'
              : 'learning';

        return { ...acc, [type]: [...acc[type], card] };
      },
      { newCards: [] as T[], learning: [] as T[], review: [] as T[] },
    );

    const startedDueCards = [...learning, ...review].filter(
      card => card.fsrs && card.fsrs.card.due < new Date().toISOString(),
    );
    const cardsToLearn = [...newCards, ...startedDueCards].toSorted(() => Math.random() - 0.5).slice(0, limit);

    return cardsToLearn;
  }

  rateFsrsCard({ card, grade }: { card?: NonNullable<DbSprout['fsrs']>['card']; grade: CardGrade }) {
    const fsrsCard = card ? convertDbCardToFsrsCard(card) : createEmptyCard<Card>(new Date());

    const recordLog = this.f.repeat(fsrsCard, new Date());
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

export enum CardGrade {
  Again = 1,
  Hard = 2,
  Good = 3,
  Easy = 4,
}
