---
name: storybook
description: Storybook patterns for Angular components including story structure, service mocking with implements Pick, and rxResource mocking. Use when creating or modifying story files (.stories.ts).
---

# Storybook

Storybook patterns for Angular components.

## Core Patterns

### Story Structure

Use `satisfies Meta<>` and `satisfies StoryObj<>` for type safety.

```typescript
import { type Meta, type StoryObj } from '@storybook/angular';

import { CardDetailsComponent } from './card-details.component';

const meta = {
  component: CardDetailsComponent,
  parameters: {
    a11y: { test: 'todo' },
  },
} satisfies Meta<CardDetailsComponent>;

export default meta;

export const Default = {
  args: {
    card: {
      id: '1',
      term: 'Example Term',
      definition: 'This is an example definition.',
      tags: ['tag1', 'tag2'],
    },
  },
} satisfies StoryObj<CardDetailsComponent>;

export const WithoutTags = {
  args: {
    card: {
      id: '2',
      term: 'Simple Term',
      definition: 'No tags on this one.',
      tags: [],
    },
  },
} satisfies StoryObj<CardDetailsComponent>;
```

### Service Mocking

Mock services with type safety using `implements Pick`.

```typescript
import { applicationConfig } from '@storybook/angular';
import { type Meta, type StoryObj } from '@storybook/angular';
import { action } from 'storybook/actions';

import { CardsService } from '../cards.service';
import { CardsListComponent } from './cards-list.component';

class MockCardsService {
  removeCard = action('removeCard');
  updateCard = action('updateCard');
}

const meta = {
  component: CardsListComponent,
  args: {
    cards: [...],
    listAriaLabel: 'Cards List',
  },
  decorators: [
    applicationConfig({
      providers: [{ provide: CardsService, useClass: MockCardsService }],
    }),
  ],
} satisfies Meta<CardsListComponent>;

export default meta;
```

### Mocking rxResource Services

For services that return `rxResource`, use `resource` for mocking.

```typescript
import { resource } from '@angular/core';

class MockCardsService implements Pick<CardsService, 'getCards' | 'updateCard'> {
  getCards() {
    return resource({
      loader: async () => [{ id: '1', term: 'Mock Card', definition: 'Mock definition', tags: [] }] as DbCard[],
    });
  }
  updateCard = action('updateCard') as CardsService['updateCard'];
}
```

### Custom Render Function

For directives or complex templates, use custom render.

```typescript
const meta = {
  component: ButtonDirective,
  render: args => ({
    template: `
      <button appButton appButtonType="${args.type}">
        Button Text
      </button>
    `,
    props: args,
  }),
} satisfies Meta<ButtonDirective>;
```

### Story with Router Provider

```typescript
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from 'src/app/app.routes';

const meta = {
  component: LayoutComponent,
  parameters: { layout: 'fullscreen' },
  render: () => ({
    applicationConfig: {
      providers: [provideRouter(routes, withHashLocation())],
    },
    template: `
      <app-layout>
        <p>Page content</p>
      </app-layout>
    `,
  }),
} satisfies Meta<LayoutComponent>;
```

### Story with Multiple States

```typescript
export const Default = {} satisfies StoryObj<CardsListComponent>;

export const Loading = {
  args: {
    isLoading: true,
    cards: [],
  },
} satisfies StoryObj<CardsListComponent>;

export const LoadingError = {
  args: {
    loadingError: new Error('Failed to load cards.'),
    cards: [],
  },
} satisfies StoryObj<CardsListComponent>;

export const Empty = {
  args: {
    cards: [],
  },
} satisfies StoryObj<CardsListComponent>;
```

### Using argsToTemplate

Pass args directly to component with custom render.

```typescript
const meta = {
  component: MyComponent,
  render: args => ({
    props: args,
    template: `
      <app-my-component 
        ${argsToTemplate(args)} 
        [extraProp]="true"
      ></app-my-component>
    `,
  }),
} satisfies Meta<MyComponent>;
```

## Best Practices

1. **Keep common args in meta** - Don't repeat in every story
2. **Don't keep empty objects** - Remove empty `parameters` or `args`
3. **Use action() for outputs** - Track emitted events
4. **Mock all required services** - Component won't work without them

## Reference Files

- `src/app/cards/cards-list/cards-list.stories.ts` - Basic story with service mock
- `src/app/cards/search-cards/search-cards.stories.ts` - rxResource mock pattern
- `src/app/ui/button/button.stories.ts` - Directive with custom render
- `src/app/layout/layout.stories.ts` - Story with router provider
- `src/app/cards/card-details/card-details.stories.ts` - Multiple story states
