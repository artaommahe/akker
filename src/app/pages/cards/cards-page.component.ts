import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CardsService } from 'src/app/cards/cards.service';

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

      @switch (cards.status()) {
        @case ('loading') {
          <p>Loading...</p>
        }
        @case ('error') {
          <p class="text-semantic-danger">Error loading cards list:</p>
          <p>{{ cards.error() }}</p>
        }
        @default {
          <app-cards-list [cards]="formattedCards()" (showDetails)="onShowDetails($event)" />
        }
      }

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
  private cardsService = inject(CardsService);

  cards = this.cardsService.getCards();
  formattedCards = computed(
    () => this.cards.value()?.map(card => ({ ...card, stability: card.fsrs?.card.stability })) ?? [],
  );
  cardDetailsDialog = signal<{ open: boolean; card: CardDetailsCard | null }>({ open: false, card: null });

  onShowDetails(cardId: string) {
    const card = this.cards.value()?.find(card => card.id === cardId);

    if (!card) {
      throw new Error(`Card with id ${cardId} not found`);
    }

    this.cardDetailsDialog.set({ open: true, card });
  }

  closeCardDetailsDialog() {
    this.cardDetailsDialog.update(value => ({ ...value, open: false }));
  }
}
