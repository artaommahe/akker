import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CardsComponent, type Card } from './cards/cards.component';
import { BarnService } from '../barn/barn.service';
import { LearningService } from './learning';
import { ButtonDirective } from '../ui/button/button';
import { DialogComponent } from '../ui/dialog/dialog.component';

@Component({
  selector: 'app-learn-cards',
  template: `
    <button appButton (click)="learnCards()">Learn</button>

    @if (cardsToLearn(); as cards) {
      <app-dialog (close)="cardsToLearn.set(null)">
        <app-cards [cards]="cards" />
      </app-dialog>
    }
  `,
  imports: [CardsComponent, ButtonDirective, DialogComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnCardsComponent {
  private barnService = inject(BarnService);
  private learningService = inject(LearningService);

  cardsToLearn = signal<Card[] | null>(null);

  learnCards() {
    const sprouts = this.barnService.sprouts()?.map(sprout => sprout.toJSON());

    if (!sprouts) {
      return;
    }

    const cards = this.learningService.getCardsToLearn(sprouts, cardsToLearnAmount).map(sprout => ({
      id: sprout.name,
      name: sprout.name,
    }));

    this.cardsToLearn.set(cards);
  }
}

const cardsToLearnAmount = 15;
