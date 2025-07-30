import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';

import { ButtonDirective } from '../../ui/button/button';
import { CardGrade } from '../learning.service';

// TODO: add tests
@Component({
  selector: 'app-learn-cards',
  template: `
    <div class="flex h-full flex-col gap-4 pb-16">
      <div class="text-secondary flex items-center justify-between">
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

      <button
        class="border-primary/10 flex grow flex-col items-center justify-center gap-2 rounded-sm border p-8"
        (click)="onCardClick()"
      >
        @if (currentCard(); as currentCard) {
          @if (showCardDefinition()) {
            <span class="text-primary text-2xl break-all">
              <markdown [data]="currentCard.fullTerm || currentCard.term" [inline]="true" />
            </span>
            @if (currentCard.definition) {
              <p class="text-secondary text-left">
                <markdown [data]="currentCard.definition" />
              </p>
            }
          } @else {
            <span class="text-primary text-2xl break-all">{{ currentCard.term }}</span>
          }
        } @else {
          <span class="text-secondary text-2xl">Done!</span>
        }
      </button>

      <div class="flex items-center justify-around" [class.invisible]="!currentCard()">
        <button appButton appButtonSemantic="danger" (click)="rate(CardGrade.Again)">Again</button>
        <button appButton appButtonSemantic="warning" (click)="rate(CardGrade.Hard)">Hard</button>
        <button appButton appButtonSemantic="success" (click)="rate(CardGrade.Good)">Good</button>
        <button appButton (click)="rate(CardGrade.Easy)">Easy</button>
      </div>
    </div>
  `,
  imports: [ButtonDirective, MarkdownComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnCardsComponent {
  cards = input.required<LearnCardsCard[]>();
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
  showCardDefinition = signal(false);

  private cardsRate = signal<Record<string, CardGrade>>({});

  onCardClick() {
    const currentCard = this.currentCard();

    if (!currentCard?.definition && !currentCard?.fullTerm) {
      return;
    }

    this.showCardDefinition.update(showCardDefinition => !showCardDefinition);
  }

  rate(grade: CardGrade) {
    const currentCard = this.currentCard();

    if (!currentCard) {
      return;
    }

    this.cardsRate.set({ ...this.cardsRate(), [currentCard.id]: grade });
    this.rateCard.emit({ id: currentCard.id, grade });
    this.showCardDefinition.set(false);
  }
}

export interface LearnCardsCard {
  id: string;
  term: string;
  fullTerm?: string;
  definition: string;
}
