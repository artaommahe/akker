import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { BarnService } from '../../../barn/barn.service';
import { CardDetailsDialogComponent } from '../../../cards/card-details-dialog/card-details-dialog.component';
import type { CardDetailsCard } from '../../../cards/card-details/card-details.component';
import { CardsListItemComponent } from '../../../cards/cards-list-item/cards-list-item.component';

@Component({
  selector: 'app-last-cards-list',
  template: `
    <section class="flex flex-col gap-2">
      <h2 class="text-secondary text-lg">Last cards</h2>

      <ul class="flex flex-col gap-2" aria-label="Last cards list">
        @for (card of lastCards(); track card.id) {
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
  `,
  imports: [CardsListItemComponent, CardDetailsDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastCardsListComponent {
  private barnService = inject(BarnService);

  lastCards = computed(() =>
    this.barnService
      .cards()
      ?.toSorted((a, b) => b.addedAt.localeCompare(a.addedAt))
      .slice(0, lastCardsCount)
      .map(card => ({ ...card.toMutableJSON(), stability: card.fsrs?.card.stability })),
  );
  cardDetailsDialog = signal<{ open: boolean; card: CardDetailsCard | null }>({ open: false, card: null });

  closeCardDetailsDialog() {
    this.cardDetailsDialog.update(value => ({ ...value, open: false }));
  }
}

const lastCardsCount = 10;
