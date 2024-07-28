import { Injectable } from '@angular/core';
import { State } from 'ts-fsrs';

@Injectable({ providedIn: 'root' })
export class LearningService {
  // TODO: add tests
  getCardsToLearn<T extends { id: string; fsrs?: CardFsrs }, R extends T & { fsrs: CardFsrs }>(
    allCards: T[],
    limit: number,
  ): R[] {
    const cards = allCards.map(this.ensureFsrs);

    let { newCards, learning, review } = cards.reduce(
      (acc, card) => {
        const type =
          card.fsrs.state === State.New ? 'newCards' : card.fsrs.state === State.Review ? 'review' : 'learning';

        return { ...acc, [type]: [...acc[type], card] };
      },
      { newCards: [] as R[], learning: [] as R[], review: [] as R[] },
    );

    newCards = newCards.toSorted(() => Math.random() - 0.5);
    learning = learning.toSorted((a, b) => a.fsrs.due.getTime() - b.fsrs.due.getTime());
    review = review
      .filter(card => card.fsrs.due <= new Date())
      .toSorted((a, b) => a.fsrs.due.getTime() - b.fsrs.due.getTime());

    return [...newCards, ...learning, ...review].slice(0, limit);
  }

  private ensureFsrs<T extends { fsrs?: CardFsrs }>(card: T): T & { fsrs: CardFsrs } {
    return { ...card, fsrs: card.fsrs ?? { state: State.New, due: new Date() } };
  }
}

interface CardFsrs {
  state: State;
  due: Date;
}
