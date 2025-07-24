import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounce, map, of, timer } from 'rxjs';
import type { GetCardsParams } from 'src/app/barn/cards-api.service';
import { IconComponent } from 'src/app/ui/icon/icon';
import { InputDirective } from 'src/app/ui/input/input';

import { CardDetailsDialogComponent } from '../card-details-dialog/card-details-dialog.component';
import type { CardDetailsCard } from '../card-details/card-details.component';
import { CardsListItemComponent } from '../cards-list-item/cards-list-item.component';
import { CardsService } from '../cards.service';

@Component({
  selector: 'app-search-cards',
  template: `
    <!-- NOTE: using button with explicit 'click' listener provides a better accessibility. Imitates input's styles-->
    <button
      class="bg-secondary focus-visible:border-primary text-secondary w-full rounded-lg border border-transparent p-2 text-left outline-hidden"
      (click)="dialogIsVisibleNew.set(true)"
    >
      Search cards...
    </button>

    <dialog
      class="border-secondary text-primary bg-primary backdrop:bg-primary/50 fixed m-2 max-h-[80vh] w-[calc(100vw-1rem)] flex-col gap-2 rounded-xl border p-2 [max-block-size:unset] [max-inline-size:unset] backdrop:backdrop-blur-xs"
      [class.flex]="dialogIsVisibleNew()"
      (close)="dialogIsVisibleNew.set(false)"
      #searchDialog
    >
      <div class="flex items-center gap-2">
        <input
          class="grow"
          appInput
          type="text"
          aria-label="Search cards"
          placeholder="Search cards..."
          [value]="searchString()"
          (input)="setSearchString($event)"
          (keyup.Esc)="cancelSearch()"
        />

        @if (searchString().length > 0) {
          <button class="flex shrink-0" type="button" aria-label="Clear search string" (click)="cancelSearch()">
            <app-icon class="text-secondary size-6" name="crossInCircle" />
          </button>
        }
      </div>

      @if (searchParams()) {
        @if (searchResult.status() === 'error') {
          <p class="text-semantic-danger">Error loading search results:</p>
          <p>{{ searchResult.error() }}</p>
        } @else if (formattedSearchResult().length === 0) {
          <p>No results found</p>

          <ng-container *ngTemplateOutlet="syntax"></ng-container>
        } @else {
          <ul class="flex flex-col gap-2" aria-label="Search cards list">
            @for (card of formattedSearchResult(); track card.id) {
              <li>
                <app-cards-list-item [card]="card" (showDetails)="cardDetailsDialog.set({ open: true, card })" />
              </li>
            }
          </ul>
        }
      } @else {
        <ng-container *ngTemplateOutlet="syntax"></ng-container>
      }

      <ng-template #syntax>
        <section class="text-secondary">
          <h3 class="text-lg">Search syntax:</h3>
          <ul class="list-disc pl-4">
            <li>
              <code>tags:tag1,tag2</code>
              - search for cards with the specified tags
            </li>
            <li>
              Remaining text is treated as a search term. For example, searching for
              <code>foo bar</code>
              will return cards that contain this exact substring.
            </li>
          </ul>
        </section>
      </ng-template>
    </dialog>

    <app-card-details-dialog
      [open]="cardDetailsDialog().open"
      [card]="cardDetailsDialog().card"
      (dismiss)="closeCardDetailsDialog()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardsListItemComponent, CardDetailsDialogComponent, InputDirective, IconComponent, NgTemplateOutlet],
})
export class SearchCardsComponent {
  private cardsService = inject(CardsService);

  dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('searchDialog');
  searchPlaceholderRef = viewChild.required<ElementRef<HTMLInputElement>>('searchPlaceholder');

  dialogIsVisibleNew = signal(false);

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

  constructor() {
    effect(() => {
      if (this.dialogIsVisibleNew()) {
        this.dialogRef().nativeElement.showModal();
      } else {
        this.dialogRef().nativeElement.close();
      }
    });
  }

  setSearchString(event: Event) {
    this.searchString.set((event.target as HTMLInputElement).value);
  }

  cancelSearch() {
    this.searchString.set('');
    this.dialogIsVisibleNew.set(false);
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
