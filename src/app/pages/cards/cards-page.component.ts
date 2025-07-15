import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { BarnService } from '../../barn/barn.service';
import { AddCardsButtonComponent } from '../../cards/add-cards-button/add-cards-button.component';
import { CardDetailsDialogComponent } from '../../cards/card-details-dialog/card-details-dialog.component';
import type { CardDetailsCard } from '../../cards/card-details/card-details.component';
import { LearnCardsComponent } from '../../learning/learn-cards.component';
import { CardsListComponent } from './cards-list/cards-list.component';

@Component({
  selector: 'app-cards-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-learn-cards />

      <app-cards-list [cards]="cards()" (showDetails)="onShowDetails($event)" />

      <app-card-details-dialog
        [open]="cardDetailsDialog().open"
        [card]="cardDetailsDialog().card"
        (dismiss)="closeCardDetailsDialog()"
      />

      <app-add-cards-button />
    </div>
  `,
  imports: [CardsListComponent, CardDetailsDialogComponent, LearnCardsComponent, AddCardsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsPageComponent {
  private barnService = inject(BarnService);

  cards = computed(
    () =>
      this.barnService.cards()?.map(card => ({ ...card.toMutableJSON(), stability: card.fsrs?.card.stability })) ?? [],
  );
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
