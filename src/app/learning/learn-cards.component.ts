import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { BarnService } from '../barn/barn.service';
import { ButtonDirective } from '../ui/button/button';
import { DialogComponent } from '../ui/dialog/dialog.component';
import { type Card, CardsComponent } from './cards/cards.component';
import { type CardGrade, LearningService } from './learning.service';

@Component({
  selector: 'app-learn-cards',
  template: `
    <button appButton (click)="learnCards()">Learn</button>

    <app-dialog [open]="cardsToLearnDialog().open" (close)="closeCardsDialog()">
      <ng-template>
        @if (cardsToLearnDialog().cards; as cards) {
          <app-cards [cards]="cards" (rateCard)="onRateCard($event)" />
        }
      </ng-template>
    </app-dialog>
  `,
  imports: [CardsComponent, ButtonDirective, DialogComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnCardsComponent {
  private barnService = inject(BarnService);
  private learningService = inject(LearningService);

  cardsToLearnDialog = signal<{ open: boolean; cards: Card[] | null }>({ open: false, cards: null });

  learnCards() {
    const cards = this.barnService.cards()?.map(cards => cards.toJSON());

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
    const card = this.barnService
      .cards()
      ?.find(card => card.id === id)
      ?.toJSON();

    if (!card) {
      return;
    }

    const newFsrsCard = this.learningService.rateFsrsCard({ card: card.fsrs?.card, grade });

    await this.barnService.updateCard(card.id, {
      fsrs: { ...card.fsrs, card: newFsrsCard },
    });
  }
}

const cardsToLearnCount = 15;
