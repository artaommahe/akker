import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import type { DbCard } from 'src/app/barn/rxdb/schema/cards';

import { CardsService } from '../../cards/cards.service';
import { ButtonDirective } from '../../ui/button/button';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { type LearnCardsCard, LearnCardsComponent } from '../learn-cards/learn-cards.component';
import { type CardGrade, LearningService } from '../learning.service';

@Component({
  selector: 'app-learn-cards-button',
  template: `
    @if (cards()?.length) {
      <button appButton (click)="openLearnCardsDialog()">Learn</button>
    }

    <app-dialog [open]="showLearnCardsDialog()" (dismiss)="closeLearnCardsDialog()">
      <ng-template>
        <app-learn-cards [cards]="currentCardsToLearn()" (rateCard)="onRateCard($event)" />
      </ng-template>
    </app-dialog>
  `,
  imports: [LearnCardsComponent, ButtonDirective, DialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnCardsButtonComponent {
  private cardsService = inject(CardsService);
  private learningService = inject(LearningService);

  cards = input.required<LearnCardsButtonCard[] | undefined>();

  currentCardsToLearn = signal<LearnCardsCard[]>([]);
  showLearnCardsDialog = signal(false);

  openLearnCardsDialog() {
    // can't use `computed` here cause it will (may) be re-evaluated on every card rate
    const cardsToLearn = this.learningService.selectCardsToLearn(this.cards() ?? [], cardsToLearnCount);

    this.currentCardsToLearn.set(cardsToLearn);
    this.showLearnCardsDialog.set(true);
  }

  closeLearnCardsDialog() {
    this.showLearnCardsDialog.set(false);
  }

  async onRateCard({ id, grade }: { id: string; grade: CardGrade }) {
    const card = this.cards()?.find(card => card.id === id);

    if (!card) {
      return;
    }

    const newFsrsCard = this.learningService.rateFsrsCard({ card: card.fsrs?.card, grade });

    await this.cardsService.updateCard(card.id, { fsrs: { ...card.fsrs, card: newFsrsCard } });
  }
}

const cardsToLearnCount = 15;

interface LearnCardsButtonCard extends LearnCardsCard, Pick<DbCard, 'fsrs'> {}
