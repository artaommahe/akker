import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { BarnService } from '../barn/barn.service';
import { ButtonDirective } from '../ui/button/button';
import { DialogComponent } from '../ui/dialog/dialog.component';
import { type Card, CardGrade, CardsComponent } from './cards/cards.component';
import { LearningService } from './learning';

@Component({
  selector: 'app-learn-cards',
  template: `
    <button appButton (click)="learnCards()">Learn</button>

    <app-dialog [open]="cardsToLearnModal().show" (close)="closeCardsModal()">
      <ng-template>
        @if (cardsToLearnModal().cards; as cards) {
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

  cardsToLearnModal = signal<{ show: boolean; cards: Card[] | null }>({ show: false, cards: null });

  learnCards() {
    const sprouts = this.barnService.sprouts()?.map(sprout => sprout.toJSON());

    if (!sprouts) {
      return;
    }

    const cards = this.learningService.selectCardsToLearn(sprouts, cardsToLearnAmount);

    this.cardsToLearnModal.set({ show: true, cards });
  }

  closeCardsModal() {
    this.cardsToLearnModal.update(value => ({ ...value, show: false }));
  }

  async onRateCard({ id, grade }: { id: string; grade: CardGrade }) {
    const sprout = this.barnService
      .sprouts()
      ?.find(sprout => sprout.id === id)
      ?.toJSON();

    if (!sprout) {
      return;
    }

    const newCard = this.learningService.rateCard({ card: sprout.fsrs?.card, grade });

    await this.barnService.updateSprout(sprout.id, {
      fsrs: { ...sprout.fsrs, card: newCard },
    });
  }
}

const cardsToLearnAmount = 15;
