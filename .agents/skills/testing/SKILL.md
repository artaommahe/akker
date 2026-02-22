---
name: testing
description: Vitest testing patterns for Angular including TestBed setup, test.each parameterized tests, and mocking. Use when writing or modifying test files (.spec.ts).
---

# Testing

Vitest testing patterns for Angular.

## Core Patterns

### Test Imports

Import from Vitest, not Jasmine.

```typescript
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// DON'T use Jasmine imports
// import { beforeEach, describe, it, expect } from '@angular/core/testing';
```

### Basic Test Structure

```typescript
describe('ServiceName', () => {
  let service: ServiceName;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceName],
    });
    service = TestBed.inject(ServiceName);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('methodName', () => {
    test('should do something', () => {
      const result = service.methodName();
      expect(result).toBe(expectedValue);
    });
  });
});
```

### Parameterized Tests with test.each

Use `test.each` for multiple test cases.

```typescript
describe('parseSearchString', () => {
  test.each([
    // [input, expectedOutput]
    ['tags:tag1', { term: '', tags: ['tag1'], addedAfter: undefined }],
    ['tags:tag1,tag2', { term: '', tags: ['tag1', 'tag2'], addedAfter: undefined }],
    ['hello world', { term: 'hello world', tags: [], addedAfter: undefined }],
    ['tags:tag1 search term', { term: 'search term', tags: ['tag1'], addedAfter: undefined }],
    ['last:2d', { term: '', tags: [], addedAfter: expect.any(Date) }],
    ['last:3w', { term: '', tags: [], addedAfter: expect.any(Date) }],
    ['last:1m', { term: '', tags: [], addedAfter: expect.any(Date) }],
  ])('should parse search string `%s`', (searchString, expectedSearchParams) => {
    const result = searchService.parseSearchString(searchString);
    expect(result).toEqual(expectedSearchParams);
  });
});
```

### Mocking Services

```typescript
import { vi } from 'vitest';

// Create mock with type safety
class MockCardsService implements Pick<CardsService, 'getCards' | 'updateCard'> {
  getCards = vi.fn().mockReturnValue([]);
  updateCard = vi.fn().mockResolvedValue({});
}

// Or with satisfies for partial mocking
const mockService = {
  method: vi.fn(),
} satisfies Pick<RealService, 'method'>;
```

### TestBed with Mocks

```typescript
describe('CardsListComponent', () => {
  let component: CardsListComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CardsListComponent, { provide: CardsService, useClass: MockCardsService }],
    });
    component = TestBed.inject(CardsListComponent);
  });
});
```

### Timers and Async

```typescript
describe('debounced search', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should debounce input', async () => {
    const { searchService } = setup();

    searchService.search('test');
    vi.advanceTimersByTime(299);
    expect(searchService.performSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(searchService.performSearch).toHaveBeenCalledWith('test');
  });
});
```

### Testing Signals

```typescript
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('ComponentWithSignals', () => {
  test('should update signal value', () => {
    const count = signal(0);

    expect(count()).toBe(0);

    count.set(5);
    expect(count()).toBe(5);

    count.update(n => n + 1);
    expect(count()).toBe(6);
  });
});
```

### Zoneless Test Setup

```typescript
// src/test-setup.ts
import { provideZonelessChangeDetection } from '@angular/core';
import { NgModule } from '@angular/core';

@NgModule({
  providers: [provideZonelessChangeDetection()],
})
export class ZonelessTestModule {}

// In test file
beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [ZonelessTestModule],
    providers: [MyService],
  });
});
```

## Reference Files

- `src/app/cards/search.service.spec.ts` - Service test with test.each
- `src/app/app.component.spec.ts` - Component test example
- `src/test-setup.ts` - Zoneless test configuration
