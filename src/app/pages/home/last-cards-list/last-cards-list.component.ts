import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { BarnService } from '../../../barn/barn.service';
import { CardDetailsDialogComponent } from '../../../cultivating/card-details-dialog/card-details-dialog.component';
import type { CardDetailsCard } from '../../../cultivating/card-details/card-details.component';
import { CardsListItemComponent } from '../../../cultivating/cards-list-item/cards-list-item.component';

@Component({
  selector: 'app-last-cards-list',
  template: `
    <section class="flex flex-col gap-2">
      <h2 class="text-lg text-secondary">Last cards</h2>

      <ul class="flex flex-col gap-2">
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
      (close)="closeCardDetailsDialog()"
    />
  `,
  imports: [CardsListItemComponent, CardDetailsDialogComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastCardsListComponent {
  private barnService = inject(BarnService);

  lastCards = computed(() =>
    this.barnService
      .cards()
      ?.toSorted((a, b) => b.addedAt.localeCompare(a.addedAt))
      .slice(0, lastCardsAmount),
  );
  cardDetailsDialog = signal<{ open: boolean; card: CardDetailsCard | null }>({ open: false, card: null });

  closeCardDetailsDialog() {
    this.cardDetailsDialog.update(value => ({ ...value, open: false }));
  }
}

const lastCardsAmount = 10;
