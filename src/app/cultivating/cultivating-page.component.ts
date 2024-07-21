import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SproutsListComponent } from './sprouts-list/sprouts-list.component';
import { SproutDetailsComponent, type SproutDetailsSprout } from './sprout-details/sprout-details.component';
import { BarnService } from '../barn/barn.service';
import { DialogComponent } from '../ui/dialog/dialog.component';
import { CardsComponent, type Card } from '../cards/cards.component';
import { ButtonDirective } from '../ui/button/button';

@Component({
  selector: 'app-cultivating-page',
  template: `
    <div class="flex flex-col items-start gap-4">
      <button appButton (click)="onShowCards()">Cards</button>

      <app-sprouts-list [sprouts]="sprouts() ?? []" (showDetails)="sproutDetails.set($event)" />

      @if (sproutDetails(); as sprout) {
        <app-dialog (close)="sproutDetails.set(null)">
          <app-sprout-details
            [sprout]="sprout"
            (cancel)="sproutDetails.set(null)"
            (remove)="onRemoveSprout(sprout.name)"
            (update)="onUpdateSprout(sprout.name, $event)"
          />
        </app-dialog>
      }

      @if (showCards(); as cards) {
        <app-dialog (close)="showCards.set(null)">
          <app-cards [cards]="cards" />
        </app-dialog>
      }
    </div>
  `,
  imports: [SproutsListComponent, SproutDetailsComponent, DialogComponent, CardsComponent, ButtonDirective],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CultivatingPageComponent {
  private barnService = inject(BarnService);

  sprouts = this.barnService.sprouts;
  sproutDetails = signal<SproutDetailsSprout | null>(null);
  showCards = signal<Card[] | null>(null);

  onRemoveSprout(name: string) {
    this.barnService.removeSprout(name);
    this.sproutDetails.set(null);
  }

  onUpdateSprout(name: string, value: Partial<SproutDetailsSprout>) {
    this.barnService.updateSprout(name, value);
    this.sproutDetails.set(null);
  }

  onShowCards() {
    const sprouts = this.sprouts();

    if (!sprouts) {
      return;
    }

    const cardsToLearn = sprouts
      .toSorted(() => Math.random() - 0.5)
      .slice(0, cardsAmount)
      .map(sprout => ({
        id: sprout.name,
        name: sprout.name,
      }));

    this.showCards.set(cardsToLearn);
  }
}

const cardsAmount = 20;
