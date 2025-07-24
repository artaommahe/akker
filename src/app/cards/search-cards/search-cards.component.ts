import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounce, map, of, timer } from 'rxjs';
import type { GetCardsParams } from 'src/app/barn/cards-api.service';
import { InputDirective } from 'src/app/ui/input/input';

import { CardDetailsDialogComponent } from '../card-details-dialog/card-details-dialog.component';
import type { CardDetailsCard } from '../card-details/card-details.component';
import { CardsListItemComponent } from '../cards-list-item/cards-list-item.component';
import { CardsService } from '../cards.service';

@Component({
  selector: 'app-search-cards',
  template: `
    <section class="flex flex-col gap-2">
      <input
        appInput
        type="text"
        aria-label="Search cards"
        placeholder="Search cards..."
        [value]="searchString()"
        (input)="setSearchString($event)"
        (keyup.Esc)="searchString.set('')"
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
  imports: [CardsListItemComponent, CardDetailsDialogComponent, InputDirective],
})
export class SearchCardsComponent {
  private cardsService = inject(CardsService);

  searchString = signal('');
  searchParams = toSignal(
    toObservable(this.searchString).pipe(
      map(searchString => searchString.trim()),
      // immediately emit empty search string to clear search results
      debounce(searchString => (searchString.length > 0 ? timer(searchResultsDebounceTimeMs) : of(undefined))),
      map(searchString => (searchString.length > 0 ? this.parseSearchString(searchString) : undefined)),
    ),
  );
  searchResult = this.cardsService.getCards(() => this.searchParams());
  formattedSearchResult = computed(
    () => this.searchResult.value()?.map(card => ({ ...card, stability: card.fsrs?.card.stability })) ?? [],
  );

  cardDetailsDialog = signal<{ open: boolean; card: CardDetailsCard | null }>({ open: false, card: null });

  setSearchString(event: Event) {
    this.searchString.set((event.target as HTMLInputElement).value);
  }

  // TODO: add tests
  /**
   * supported syntax:
   * - `tags:tag1,tag2` - search for cards with the specified tags
   * - remaining text is treated as a search term
   */
  private parseSearchString(searchString: string): GetCardsParams {
    const searchTokens = searchString.match(searchStringTokensRegex) ?? [];

    const params = searchTokens.reduce(
      (params, token) => {
        if (token.startsWith('tags:')) {
          const tags = token
            .slice(5)
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

          return { ...params, tags: [...(params.tags ?? []), ...tags] };
        }

        return { ...params, term: `${params.term} ${token}`.trim() };
      },
      { term: '', tags: [] } as GetCardsParams,
    );

    return params;
  }

  closeCardDetailsDialog() {
    this.cardDetailsDialog.update(value => ({ ...value, open: false }));
  }
}

const searchResultsDebounceTimeMs = 300;
// used a part of regex from https://github.com/nepsilon/search-query-parser/blob/8158d09c70b66168440e93ffabd720f4c8314c9b/lib/search-query-parser.js#L40
const searchStringTokensRegex = new RegExp(
  [
    // `<type>:` with single or double quotes
    // is not supported yet
    /* `(\\S+:'(?:[^'\\\\]|\\.)*')`,
    `(\\S+:"(?:[^"\\\\]|\\.)*")`, */
    // `<type>:<value>`
    `\\S+:\\S+`,
    // just remaining text
    `\\S+`,
  ].join('|'),
  'g',
);
