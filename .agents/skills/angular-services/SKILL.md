---
name: angular-services
description: Angular service patterns including dependency injection, providedIn root, inject() function, and API layer separation. Use when creating or modifying services (.service.ts files).
---

# Angular Services

Patterns for Angular services in this project.

## Core Patterns

### Service Decorator

Use `providedIn: 'root'` for singleton services.

```typescript
// DO
@Injectable({ providedIn: 'root' })
export class CardsService {
  private cardsApiService = inject(CardsApiService);
  // ...
}

// DON'T
@Injectable()
export class CardsService {
  constructor(private cardsApiService: CardsApiService) {}
}
```

### Dependency Injection with inject()

Use `inject()` function instead of constructor injection.

```typescript
// DO
@Injectable({ providedIn: 'root' })
export class CardsService {
  private cardsApiService = inject(CardsApiService);
  private barnDbService = inject(BarnDbService);
}

// DON'T
@Injectable({ providedIn: 'root' })
export class CardsService {
  constructor(
    private cardsApiService: CardsApiService,
    private barnDbService: BarnDbService,
  ) {}
}
```

### Feature Service vs API Service Separation

Maintain clear separation between layers:

**Feature Service** (`cards.service.ts`):

- Business logic
- Wraps API calls in `rxResource` for component consumption
- Located in feature directory

```typescript
// src/app/cards/cards.service.ts
@Injectable({ providedIn: 'root' })
export class CardsService {
  private cardsApiService = inject(CardsApiService);

  getCards(params?: () => GetCardsParams | undefined) {
    return rxResource({
      params,
      stream: ({ params }) => this.cardsApiService.getCards(params ?? undefined),
    });
  }

  updateCard(card: DbCard) {
    return this.cardsApiService.updateCard(card);
  }
}
```

**API Service** (`barn/cards-api.service.ts`):

- Direct database/API operations
- Returns Observables
- Located in `barn/` directory

```typescript
// src/app/barn/cards-api.service.ts
@Injectable({ providedIn: 'root' })
export class CardsApiService {
  private barnDbService = inject(BarnDbService);

  getCards({ limit, term, tags, addedAfter }: GetCardsParams = {}) {
    return from(this.barnDbService.getDb()).pipe(
      switchMap(db => db.sprouts.find({ selector: {...} }).$),
      map(cards => cards.map(card => card.toMutableJSON())),
    );
  }

  updateCard(card: DbCard): Promise<DbCard> {
    return this.barnDbService.getDb().then(db =>
      db.sprouts.upsert(card)
    );
  }
}
```

### Service with rxResource

```typescript
@Injectable({ providedIn: 'root' })
export class SeedsService {
  private seedsApiService = inject(SeedsApiService);

  getSeeds() {
    return rxResource({
      stream: () => this.seedsApiService.getSeeds(),
    });
  }

  // With params
  searchSeeds(params: () => SearchParams) {
    return rxResource({
      params,
      stream: ({ params }) => this.seedsApiService.search(params),
    });
  }
}
```

## Directory Structure

```
src/app/
├── barn/                      # Data layer
│   ├── barn-db.service.ts     # Database connection
│   ├── cards-api.service.ts   # Cards API operations
│   ├── seeds-api.service.ts   # Seeds API operations
│   └── sync-api.service.ts    # Sync operations
├── cards/
│   └── cards.service.ts       # Cards feature service
└── seeds/
    └── seeds.service.ts       # Seeds feature service
```

## Reference Files

- `src/app/cards/cards.service.ts` - Feature service with rxResource
- `src/app/barn/cards-api.service.ts` - API service with RxDB
- `src/app/seeds/seeds.service.ts` - Another feature service example
- `src/app/barn/barn-db.service.ts` - Database service
