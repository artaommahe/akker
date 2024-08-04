import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ButtonDirective } from '../../ui/button/button';

// TODO: add tests
@Component({
  selector: 'app-cards',
  template: `
    <div class="flex h-full flex-col gap-4 py-16">
      <div class="flex items-center justify-between text-secondary">
        <div>
          to go
          <span class="text-action-primary">({{ status().toGo }})</span>
        </div>
        <div>
          to repeat
          <span class="text-semantic-warning">({{ status().toRepeat }})</span>
        </div>
        <div>
          learning
          <span class="text-semantic-success">({{ status().learning }})</span>
        </div>
      </div>

      <div class="flex grow items-center justify-center rounded border border-primary/10 p-8">
        @if (currentCard(); as currentCard) {
          <span class="break-all text-2xl text-primary">{{ currentCard.name }}</span>
        } @else {
          <span class="text-2xl text-secondary">Done!</span>
        }
      </div>

      <div class="flex items-center justify-around" [class.invisible]="!currentCard()">
        <button appButton appButtonSemantic="danger" (click)="rate(CardGrade.Again)">Again</button>
        <button appButton appButtonSemantic="warning" (click)="rate(CardGrade.Hard)">Hard</button>
        <button appButton appButtonSemantic="success" (click)="rate(CardGrade.Good)">Good</button>
        <button appButton (click)="rate(CardGrade.Easy)">Easy</button>
      </div>
    </div>
  `,
  imports: [ButtonDirective],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsComponent {
  cards = input.required<Card[]>();
  rateCard = output<{ id: string; grade: CardGrade }>();

  cardsToRate = computed(() => [
    ...this.cards().filter(card => !this.cardsRate()[card.id]),
    // TODO: fix that going over 'again' cards is stuck on a card that was rated 'again' again
    ...this.cards().filter(card => this.cardsRate()[card.id] === CardGrade.Again),
  ]);
  currentCard = computed(() => this.cardsToRate().at(0) ?? null);
  status = computed(() => ({
    toGo: this.cards().filter(card => !this.cardsRate()[card.id]).length,
    toRepeat: Object.values(this.cardsRate()).filter(rate => [CardGrade.Again].includes(rate)).length,
    learning: Object.values(this.cardsRate()).filter(rate =>
      [CardGrade.Hard, CardGrade.Good, CardGrade.Easy].includes(rate),
    ).length,
  }));
  CardGrade = CardGrade;

  private cardsRate = signal<Record<string, CardGrade>>({});

  rate(grade: CardGrade) {
    const currentCard = this.currentCard();

    if (!currentCard) {
      return;
    }

    this.cardsRate.set({ ...this.cardsRate(), [currentCard.id]: grade });
    this.rateCard.emit({ id: currentCard.id, grade });
  }
}

export interface Card {
  id: string;
  name: string;
}

export enum CardGrade {
  Again = 1,
  Hard = 2,
  Good = 3,
  Easy = 4,
}
