import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { CardDetailsDialogComponent } from '../../../cards/card-details-dialog/card-details-dialog.component';
import { type CardDetailsCard } from '../../../cards/card-details/card-details.component';
import { CardsListItemComponent } from '../../../cards/cards-list-item/cards-list-item.component';
import { CardsService } from '../../../cards/cards.service';

@Component({
  selector: 'app-unsorted-cards',
  template: `
    <section>
      <h2 class="text-secondary text-lg">
        Unsorted cards
        @if (unsortedCards.hasValue()) {
          ({{ unsortedCardsAmount() }})
        }
      </h2>

      @switch (unsortedCards.status()) {
        @case ('loading') {
          <p>Loading...</p>
        }
        @case ('error') {
          <p class="text-semantic-danger">Error loading unsorted cards:</p>
          <p>{{ unsortedCards.error() }}</p>
        }
        @default {
          <ul class="columns-2 gap-4" aria-label="Unsorted cards list">
            @for (card of someUnsortedCards(); track card.id) {
              <li>
                <app-cards-list-item [card]="card" (showDetails)="cardDetailsDialog.set({ open: true, card })" />
              </li>
            }
          </ul>
        }
      }
    </section>

    <app-card-details-dialog
      [open]="cardDetailsDialog().open"
      [card]="cardDetailsDialog().card"
      (dismiss)="closeCardDetailsDialog()"
    />
  `,
  imports: [CardDetailsDialogComponent, CardsListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsortedCardsComponent {
  private cardsService = inject(CardsService);

  unsortedCards = this.cardsService.getUnsortedCards();

  unsortedCardsAmount = computed(() => this.unsortedCards.value()?.length ?? 0);
  someUnsortedCards = computed(
    () =>
      this.unsortedCards
        .value()
        ?.slice(0, someUnsortedCardsCount)
        .map(card => ({ ...card, stability: card.fsrs?.card.stability })) ?? [],
  );

  cardDetailsDialog = signal<{ open: boolean; card: CardDetailsCard | null }>({ open: false, card: null });

  closeCardDetailsDialog() {
    this.cardDetailsDialog.update(value => ({ ...value, open: false }));
  }
}

const someUnsortedCardsCount = 10;
