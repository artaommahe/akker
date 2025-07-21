import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, map } from 'rxjs';
import type { GetCardsParams } from 'src/app/barn/cards-api.service';

import { CardDetailsDialogComponent } from '../card-details-dialog/card-details-dialog.component';
import type { CardDetailsCard } from '../card-details/card-details.component';
import { CardsListItemComponent } from '../cards-list-item/cards-list-item.component';
import { CardsService } from '../cards.service';

@Component({
  selector: 'app-search-cards',
  template: `
    <section class="flex flex-col gap-2">
      <input
        class="w-full"
        type="text"
        aria-label="Search cards"
        placeholder="Search cards..."
        [value]="searchString()"
        (input)="setSearchString($event)"
      />

      @if (searchParams()) {
        @if (searchResult.status() === 'error') {
          <p class="text-semantic-danger">Error loading search results:</p>
          <p>{{ searchResult.error() }}</p>
        } @else if (formattedSearchResult().length === 0) {
          <p>No results found</p>
        } @else {
          <ul class="flex flex-col gap-2" aria-label="Search cards list">
            @for (card of formattedSearchResult(); track card.id) {
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardsListItemComponent, CardDetailsDialogComponent],
})
export class SearchCardsComponent {
  private cardsService = inject(CardsService);

  searchString = signal('');
  searchParams = toSignal(
    toObservable(this.searchString).pipe(
      debounceTime(searchResultsDebounceTimeMs),
      map(searchString => searchString.trim()),
      map(searchString => (searchString.length > 0 ? this.parseSearchString(searchString) : undefined)),
    ),
  );
  searchResult = this.cardsService.getCards(() => this.searchParams());
  formattedSearchResult = computed(
    () => this.searchResult.value()?.map(card => ({ ...card, stability: card.fsrs?.card.stability })) ?? [],
  );

  cardDetailsDialog = signal<{ open: boolean; card: CardDetailsCard | null }>({ open: false, card: null });

  setSearchString(event: Event) {
    this.searchString.set((event.target as HTMLTextAreaElement).value);
  }

  private parseSearchString(searchString: string): GetCardsParams {
    const term = searchString.trim();

    return { term };
  }

  closeCardDetailsDialog() {
    this.cardDetailsDialog.update(value => ({ ...value, open: false }));
  }
}

const searchResultsDebounceTimeMs = 300;
