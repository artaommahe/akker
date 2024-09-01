import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { BarnService } from '../../barn/barn.service';
import { CardDetailsDialogComponent } from '../../cultivating/card-details-dialog/card-details-dialog.component';
import type { CardDetailsCard } from '../../cultivating/card-details/card-details.component';
import { CardsListComponent } from '../../cultivating/cards-list/cards-list.component';
import { LearnCardsComponent } from '../../learning/learn-cards.component';

@Component({
  selector: 'app-cards-page',
  template: `
    <div class="flex flex-col items-start gap-4">
      <app-learn-cards />

      <app-cards-list [cards]="cards() ?? []" (showDetails)="onShowDetails($event)" />

      <app-card-details-dialog
        [open]="cardDetailsDialog().open"
        [card]="cardDetailsDialog().card"
        (close)="closeCardDetailsDialog()"
      />
    </div>
  `,
  imports: [CardsListComponent, CardDetailsDialogComponent, LearnCardsComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsPageComponent {
  private barnService = inject(BarnService);

  cards = this.barnService.cards;
  cardDetailsDialog = signal<{ open: boolean; card: CardDetailsCard | null }>({ open: false, card: null });

  onShowDetails(cardId: string) {
    const card = this.cards()?.find(card => card.id === cardId);

    if (!card) {
      throw new Error(`Card with id ${cardId} not found`);
    }

    this.cardDetailsDialog.set({ open: true, card });
  }

  closeCardDetailsDialog() {
    this.cardDetailsDialog.update(value => ({ ...value, open: false }));
  }
}