import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounce, map, of, timer } from 'rxjs';
import type { GetCardsParams } from 'src/app/barn/cards-api.service';
import type { DbCard } from 'src/app/barn/rxdb/schema/cards';
import { IconComponent } from 'src/app/ui/icon/icon';
import { InputDirective } from 'src/app/ui/input/input';

import { CardsListComponent } from '../cards-list/cards-list.component';
import { CardsService } from '../cards.service';

@Component({
  selector: 'app-search-cards',
  template: `
    <section class="flex max-h-[80vh] flex-col gap-2 overflow-hidden">
      <div class="flex items-center gap-2">
        <input
          class="grow"
          appInput
          type="text"
          aria-label="Search cards"
          placeholder="Search cards..."
          [value]="searchString()"
          (input)="setSearchString($event)"
          #searchInput
        />

        @if (searchParams()) {
          <button class="flex shrink-0" type="button" aria-label="Clear search string" (click)="clearSearchInput()">
            <app-icon class="text-secondary size-6" name="crossInCircle" />
          </button>
        }
      </div>

      @if (searchParams()) {
        @if (searchResult.status() === 'error') {
          <p class="text-semantic-danger">Error loading search results:</p>
          <p>{{ searchResult.error() }}</p>
        } @else if (!searchResult.isLoading() && formattedSearchResult().length === 0) {
          <p>No results found</p>

          <ng-container *ngTemplateOutlet="syntax"></ng-container>
        } @else {
          <app-cards-list class="contents" [cards]="formattedSearchResult()" ariaLabel="Search cards list" />
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
              Remaining text is treated as a search term in regex format. For example, searching for
              <code>foo bar</code>
              will return cards that contain this exact substring.
              <br />
              For advance search use regex syntax, e.g.
              <code>foo|bar</code>
              will return cards that contain either "foo" or "bar" in their text.
              <br />
              Note: special characters like
              <code>{{ charactersToEscape }}</code>
              have to be escaped with a backslash.
            </li>
          </ul>
        </section>
      </ng-template>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardsListComponent, InputDirective, IconComponent, NgTemplateOutlet],
})
export class SearchCardsComponent {
  private cardsService = inject(CardsService);

  searchInputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

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
  // prevent previous search results from being cleared while new search is in progress
  // currently there is no way to get the previous value of a resource
  // https://github.com/angular/angular/issues/58602#issuecomment-2621337106 (last point)
  cachedSearchResultValue = linkedSignal<DbCard[] | undefined, DbCard[] | undefined>({
    source: this.searchResult.value,
    computation: (newCards, previous) => newCards ?? previous?.value,
  });
  formattedSearchResult = computed(
    () => this.cachedSearchResultValue()?.map(card => ({ ...card, stability: card.fsrs?.card.stability })) ?? [],
  );

  charactersToEscape = charactersToEscape;

  constructor() {
    effect(() => {
      // `autofocus` attribute doesn't work here, most likely because how modal's content is rendered
      this.searchInputRef()?.nativeElement.focus();
    });
  }

  setSearchString(event: Event) {
    this.searchString.set((event.target as HTMLInputElement).value);
  }

  clearSearchInput() {
    this.searchString.set('');
    this.searchInputRef()?.nativeElement.focus();
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
const charactersToEscape = `.*+?^{}$()|[]\\`;
