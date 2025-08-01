import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';

import { CardDetailsDialogComponent } from '../card-details-dialog/card-details-dialog.component';
import type { CardDetailsCard } from '../card-details/card-details.component';
import { type CardsListItemCard, CardsListItemComponent } from '../cards-list-item/cards-list-item.component';

@Component({
  selector: 'app-cards-list',
  template: `
    @if (isLoading()) {
      <p>Loading...</p>
    } @else if (loadingError()) {
      <p class="text-semantic-danger">Error loading cards list:</p>
      <p>{{ loadingError() }}</p>
    } @else {
      <ul
        class="flex-col gap-2 overflow-y-scroll"
        [class.flex]="!isTwoColumnsLayout()"
        [class.columns-2]="isTwoColumnsLayout()"
        [attr.aria-label]="listAriaLabel()"
        [attr.aria-labelledby]="listAriaLabelledBy()"
      >
        @for (card of cards(); track card.id) {
          <li>
            <app-cards-list-item [card]="card" (showDetails)="cardDetailsDialog.set({ open: true, card })" />
          </li>
        }
      </ul>
    }

    <app-card-details-dialog
      [open]="cardDetailsDialog().open"
      [card]="cardDetailsDialog().card"
      (dismiss)="closeCardDetailsDialog()"
    />
  `,
  imports: [CardsListItemComponent, CardDetailsDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsListComponent {
  cards = input.required<CardsListCard[]>();
  isLoading = input(false);
  loadingError = input<Error>();
  listAriaLabel = input<string>();
  listAriaLabelledBy = input<string>();
  isTwoColumnsLayout = input(false);

  cardDetailsDialog = signal<{ open: boolean; card: CardDetailsCard | null }>({ open: false, card: null });

  constructor() {
    effect(() => {
      if (!this.listAriaLabel() && !this.listAriaLabelledBy()) {
        throw new Error('CardsListComponent: Either listAriaLabel or listAriaLabelledBy input must be provided');
      }
    });
  }

  closeCardDetailsDialog() {
    this.cardDetailsDialog.update(value => ({ ...value, open: false }));
  }
}

export interface CardsListCard extends CardsListItemCard, CardDetailsCard {}
