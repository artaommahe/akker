import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { BarnService } from '../../../barn/barn.service';
import { CardDetailsDialogComponent } from '../../../cards/card-details-dialog/card-details-dialog.component';
import { type CardDetailsCard } from '../../../cards/card-details/card-details.component';
import { CardsListItemComponent } from '../../../cards/cards-list-item/cards-list-item.component';

@Component({
  selector: 'app-unsorted-cards',
  template: `
    @if (someUnsortedCards().length > 0) {
      <section>
        <h2 class="text-secondary text-lg">Unsorted cards ({{ unsortedCardsCount() }})</h2>

        <ul class="columns-2 gap-4" aria-label="Unsorted cards list">
          @for (card of someUnsortedCards(); track card.id) {
            <li>
              <app-cards-list-item [card]="card" (showDetails)="cardDetailsDialog.set({ open: true, card })" />
            </li>
          }
        </ul>
      </section>

      <app-card-details-dialog
        [open]="cardDetailsDialog().open"
        [card]="cardDetailsDialog().card"
        (dismiss)="closeCardDetailsDialog()"
      />
    }
  `,
  imports: [CardDetailsDialogComponent, CardsListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsortedCardsComponent {
  private barnService = inject(BarnService);
  private unsortedCards = computed(() => this.barnService.cards()?.filter(card => !card.definition));

  unsortedCardsCount = computed(() => this.unsortedCards()?.length ?? 0);
  someUnsortedCards = computed(() => this.unsortedCards()?.slice(0, someUnsortedCardsCount) ?? []);

  cardDetailsDialog = signal<{ open: boolean; card: CardDetailsCard | null }>({ open: false, card: null });

  closeCardDetailsDialog() {
    this.cardDetailsDialog.update(value => ({ ...value, open: false }));
  }
}

const someUnsortedCardsCount = 10;
