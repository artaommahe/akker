import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { BarnService } from '../../../barn/barn.service';
import { CardDetailsDialogComponent } from '../../../cards/card-details-dialog/card-details-dialog.component';
import { type CardDetailsCard } from '../../../cards/card-details/card-details.component';

@Component({
  selector: 'app-unsorted-cards',
  template: `
    @if (someUnsortedCards().length > 0) {
      <section>
        <h2 class="text-lg text-secondary">Unsorted cards ({{ unsortedCardsAmount() }})</h2>

        <ul class="columns-2 gap-4">
          @for (card of someUnsortedCards(); track card.id) {
            <li>
              <button class="w-full truncate px-2 py-1 text-left" (click)="cardDetailsDialog.set({ open: true, card })">
                {{ card.term }}
              </button>
            </li>
          }
        </ul>
      </section>

      <app-card-details-dialog
        [open]="cardDetailsDialog().open"
        [card]="cardDetailsDialog().card"
        (close)="closeCardDetailsDialog()"
      />
    }
  `,
  imports: [CardDetailsDialogComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsortedCardsComponent {
  private barnService = inject(BarnService);
  private unsortedCards = computed(() => this.barnService.cards()?.filter(card => !card.definition));

  unsortedCardsAmount = computed(() => this.unsortedCards()?.length ?? 0);
  someUnsortedCards = computed(() => this.unsortedCards()?.slice(0, someUnsortedCardsAmount) ?? []);

  cardDetailsDialog = signal<{ open: boolean; card: CardDetailsCard | null }>({ open: false, card: null });

  closeCardDetailsDialog() {
    this.cardDetailsDialog.update(value => ({ ...value, open: false }));
  }
}

const someUnsortedCardsAmount = 10;
