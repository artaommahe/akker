import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CardsService } from 'src/app/cards/cards.service';

import { CardDetailsDialogComponent } from '../../../cards/card-details-dialog/card-details-dialog.component';
import type { CardDetailsCard } from '../../../cards/card-details/card-details.component';
import { CardsListItemComponent } from '../../../cards/cards-list-item/cards-list-item.component';

@Component({
  selector: 'app-last-cards-list',
  template: `
    <section class="flex flex-col gap-2">
      <h2 class="text-secondary text-lg" id="last-cards-heading">Last cards</h2>

      @switch (lastCards.status()) {
        @case ('loading') {
          <p>Loading...</p>
        }
        @case ('error') {
          <p class="text-semantic-danger">Error loading last cards list:</p>
          <p>{{ lastCards.error() }}</p>
        }
        @default {
          <ul class="flex flex-col gap-2" aria-labelledby="last-cards-heading">
            @for (card of formattedLastCards(); track card.id) {
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
  imports: [CardsListItemComponent, CardDetailsDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastCardsListComponent {
  private cardsService = inject(CardsService);

  lastCards = this.cardsService.getCards(() => ({ limit: lastCardsCount }));
  formattedLastCards = computed(
    () => this.lastCards.value()?.map(card => ({ ...card, stability: card.fsrs?.card.stability })) ?? [],
  );
  cardDetailsDialog = signal<{ open: boolean; card: CardDetailsCard | null }>({ open: false, card: null });

  closeCardDetailsDialog() {
    this.cardDetailsDialog.update(value => ({ ...value, open: false }));
  }
}

const lastCardsCount = 10;
