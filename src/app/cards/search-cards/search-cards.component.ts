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
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search-cards',
  template: `
    <section class="flex max-h-[80dvh] flex-col gap-2">
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

      @if (searchResult.status() === 'error') {
        <p class="text-semantic-danger">Error loading search results:</p>
        <p>{{ searchResult.error() }}</p>
      }

      @if (showSearchResults()) {
        @if (formattedSearchResult().length === 0) {
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
  private searchService = inject(SearchService);

  searchInputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  searchString = signal('');
  searchParams = toSignal(
    toObservable(this.searchString).pipe(
      map(searchString => searchString.trim()),
      // immediately emit empty search string to clear search results
      debounce(searchString => (searchString.length > 0 ? timer(searchResultsDebounceTimeMs) : of(undefined))),
      map(searchString => (searchString.length > 0 ? this.searchService.parseSearchString(searchString) : undefined)),
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
  // prevent search results list flickering in several cases
  // - having multiple 'not found' search results in a row
  // - from an empty search string to some search result
  showSearchResults = linkedSignal<GetCardsParams | undefined, boolean>({
    source: this.searchParams,
    computation: (searchParams, previous) =>
      // we should reset the state to `false` when `searchParams` is empty
      searchParams ? previous?.value || (this.searchResult.hasValue() && !this.searchResult.isLoading()) : false,
  });

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
}

const searchResultsDebounceTimeMs = 300;
const charactersToEscape = `.*+?^{}$()|[]\\`;
