import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { CardsService } from '../cards/cards.service';
import { ButtonDirective } from '../ui/button/button';
import { DialogComponent } from '../ui/dialog/dialog.component';
import { type Card, CardsComponent } from './cards/cards.component';
import { type CardGrade, LearningService } from './learning.service';

@Component({
  selector: 'app-learn-cards',
  template: `
    @if (cards.hasValue() && cards.value().length) {
      <button appButton (click)="learnCards()">Learn</button>
    }

    <app-dialog [open]="cardsToLearnDialog().open" (dismiss)="closeCardsDialog()">
      <ng-template>
        @if (cardsToLearnDialog().cards; as cards) {
          <app-cards [cards]="cards" (rateCard)="onRateCard($event)" />
        }
      </ng-template>
    </app-dialog>
  `,
  imports: [CardsComponent, ButtonDirective, DialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnCardsComponent {
  private cardsService = inject(CardsService);
  private learningService = inject(LearningService);

  // NOTE: should use `cardsToLearn` input instead https://github.com/artaommahe/akker/issues/71
  cards = this.cardsService.getCards();
  cardsToLearnDialog = signal<{ open: boolean; cards: Card[] | null }>({ open: false, cards: null });

  learnCards() {
    const cards = this.cards.value();

    if (!cards) {
      return;
    }

    const cardsToLearn = this.learningService.selectCardsToLearn(cards, cardsToLearnCount);

    this.cardsToLearnDialog.set({ open: true, cards: cardsToLearn });
  }

  closeCardsDialog() {
    this.cardsToLearnDialog.update(value => ({ ...value, open: false }));
  }

  async onRateCard({ id, grade }: { id: string; grade: CardGrade }) {
    const card = this.cards.value()?.find(card => card.id === id);

    if (!card) {
      return;
    }

    const newFsrsCard = this.learningService.rateFsrsCard({ card: card.fsrs?.card, grade });

    await this.cardsService.updateCard(card.id, { fsrs: { ...card.fsrs, card: newFsrsCard } });
  }
}

const cardsToLearnCount = 15;
