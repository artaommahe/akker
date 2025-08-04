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
import { LearnCardsButtonComponent } from 'src/app/learning/learn-cards-button/learn-cards-button.component';
import { IconComponent } from 'src/app/ui/icon/icon';
import { InputDirective } from 'src/app/ui/input/input';

import { CardsListComponent } from '../cards-list/cards-list.component';
import { CardsService } from '../cards.service';

@Component({
  selector: 'app-search-cards',
  template: `
    <section class="flex max-h-[80vh] flex-col gap-2">
      <div class="flex items-center gap-2">
        <input
          class="grow"
          appInput
          type="text"
          aria-label="Search cards"
          aria-describedby="search-syntax"
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
          <app-learn-cards-button [cards]="formattedSearchResult()" />

          <app-cards-list class="contents" [cards]="formattedSearchResult()" [listAriaLabel]="'Search cards list'" />
        }
      } @else {
        <ng-container *ngTemplateOutlet="syntax"></ng-container>
      }

      <ng-template #syntax>
        <section class="text-secondary" id="search-syntax">
          <h3 class="text-lg">Search syntax:</h3>
          <ul class="list-disc pl-4">
            <li>
              <code>tags:tag1,tag2</code>
              - search for cards with the specified tags
            </li>
            <li>
              <code>last:2d</code>
              ,
              <code>last:3w</code>
              ,
              <code>last:1m</code>
              - search for cards that were created or updated in the last 2 days, 1 week, or 1 month respectively
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
  imports: [CardsListComponent, InputDirective, IconComponent, NgTemplateOutlet, LearnCardsButtonComponent],
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
   * - `tags:tag1,tag2`
   * - `last:2d`, `last:3w`, `last:1m`
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
        } else if (token.startsWith('last:')) {
          const lastMatch = token.match(/last:(\d+)([dwm])/);

          if (!lastMatch) {
            return params;
          }

          const value = parseInt(lastMatch[1], 10);
          const unit = lastMatch[2];

          if (isNaN(value) || value <= 0 || !isValidDateAgoUnit(unit)) {
            return params;
          }

          const addedAfter = getDateAgo(value, unit);

          return { ...params, addedAfter };
        }

        return { ...params, term: `${params.term} ${token}`.trim() };
      },
      { term: '', tags: [], addedAfter: undefined } as GetCardsParams,
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

enum DateAgoUnit {
  Day = 'd',
  Week = 'w',
  Month = 'm',
}

const isValidDateAgoUnit = (unit: string): unit is DateAgoUnit =>
  Object.values(DateAgoUnit).includes(unit as DateAgoUnit);

const getDateAgo = (value: number, unit: DateAgoUnit) => {
  const date = new Date();

  if (unit === DateAgoUnit.Day) {
    date.setDate(date.getDate() - value);
  } else if (unit === DateAgoUnit.Week) {
    date.setDate(date.getDate() - value * 7);
  } else if (unit === DateAgoUnit.Month) {
    date.setMonth(date.getMonth() - value);
  }

  return date;
};
