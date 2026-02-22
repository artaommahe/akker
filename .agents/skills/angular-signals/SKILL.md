---
name: angular-signals
description: Angular signal patterns including signal(), computed(), linkedSignal(), rxResource, toSignal/toObservable, and effect(). Use when managing component or service state.
---

# Angular Signals

State management patterns using Angular signals.

## Core Patterns

### Signal for Local State

Use `signal()` for mutable local state.

```typescript
// DO
export class ExampleComponent {
  isOpen = signal(false);
  searchTerm = signal('');

  toggle() {
    this.isOpen.update(value => !value);
  }

  clear() {
    this.searchTerm.set('');
  }
}

// DON'T - never use mutate
this.data.mutate(value => (value.item = 'new')); // WRONG
```

### Computed for Derived State

Use `computed()` for state derived from other signals.

```typescript
export class CardRecallLevelComponent {
  stability = input.required<number | undefined>();

  recallLevel = computed(() => getRecallLevel(this.stability()));
  segmentClass = computed(() => segmentClassMap[this.recallLevel()]);
  ariaLabel = computed(() => `Card recall level: ${this.recallLevel()}`);
}

// With clsx for conditional classes
class = computed(() =>
  clsx(
    'rounded-lg border px-3 py-2',
    this.type() === 'primary' && ['border-transparent bg-action-primary'],
  ),
);
```

### linkedSignal for Dependent Mutable State

Use `linkedSignal()` when mutable state depends on another signal.

```typescript
// Cache previous value while new data loads
cachedSearchResultValue = linkedSignal<DbCard[] | undefined, DbCard[] | undefined>({
  source: this.searchResult.value,
  computation: (newCards, previous) => newCards ?? previous?.value,
});

// Control visibility based on source with previous state
showSearchResults = linkedSignal<GetCardsParams | undefined, boolean>({
  source: this.searchParams,
  computation: (searchParams, previous) =>
    searchParams ? previous?.value || (this.searchResult.hasValue() && !this.searchResult.isLoading()) : false,
});
```

### rxResource for Async Data

Use `rxResource()` to wrap observables for component consumption.

```typescript
// In service
@Injectable({ providedIn: 'root' })
export class CardsService {
  private cardsApiService = inject(CardsApiService);

  getCards(params?: () => GetCardsParams | undefined) {
    return rxResource({
      params,
      stream: ({ params }) => this.cardsApiService.getCards(params ?? undefined),
    });
  }

  getCardsCount() {
    return rxResource({ stream: () => this.cardsApiService.getCardsCount() });
  }
}

// In component
cards = this.cardsService.getCards();
formattedCards = computed(() => this.cards.value()?.map(...) ?? []);

// Accessing resource state
this.cards.value()      // The data
this.cards.isLoading()  // Loading state
this.cards.error()      // Error if any
this.cards.hasValue()   // Check if data exists
```

### toSignal and toObservable for RxJS Interop

Convert between signals and observables.

```typescript
// Observable to Signal
searchParams = toSignal(
  toObservable(this.searchString).pipe(
    debounceTime(300),
    map(searchString => this.parseSearch(searchString)),
  ),
);

// Signal to Observable (for complex operators)
isAnimated = toObservable(this.dialogRef).pipe(
  delay(0),
  map(dialogRef => window.getComputedStyle(dialogRef.nativeElement).transition !== 'none'),
);

// Combining multiple
isOpen = toSignal(
  combineLatest([toObservable(this.openInput), toObservable(this.dialogRef), this.isAnimated]).pipe(
    switchMap(([open, dialogRef, isAnimated]) => { ... }),
  ),
);
```

### Effect for Side Effects

Use `effect()` for side effects that respond to signal changes.

```typescript
constructor() {
  // Focus input when modal opens
  effect(() => {
    if (this.openInput()) {
      this.searchInputRef()?.nativeElement.focus();
    }
  });

  // Validate required inputs
  effect(() => {
    if (!this.listAriaLabel() && !this.listAriaLabelledBy()) {
      throw new Error('Either listAriaLabel or listAriaLabelledBy input must be provided');
    }
  });
}
```

## Signal Update Patterns

```typescript
// set() - direct assignment
this.isOpen.set(true);
this.searchTerm.set('');

// update() - based on current value
this.count.update(n => n + 1);
this.isOpen.update(value => !value);
this.formData.update(value => ({ ...value, open: false }));

// NEVER use mutate() - it's explicitly discouraged
```

## Reference Files

- `src/app/cards/search-cards/search-cards.component.ts` - Complex signal state with linkedSignal, rxResource
- `src/app/cards/card-recall-level/card-recall-level.component.ts` - Computed derived state
- `src/app/cards/cards.service.ts` - rxResource in services
- `src/app/ui/modal/modal.component.ts` - toSignal/toObservable interop
