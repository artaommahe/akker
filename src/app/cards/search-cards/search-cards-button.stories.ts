import { resource } from '@angular/core';
import { applicationConfig } from '@storybook/angular';
import { type Meta, type StoryObj } from '@storybook/angular';
import type { DbCard } from 'src/app/barn/rxdb/schema/cards';
import { action } from 'storybook/actions';

import { CardsService } from '../cards.service';
import { SearchCardsButtonComponent } from './search-cards-button.component';

class MockCardsService implements Pick<CardsService, 'getCards' | 'updateCard'> {
  getCards() {
    return resource({
      loader: async () =>
        [
          {
            id: '1',
            term: 'Example Term 1',
            fullTerm: 'Example Full Term 1',
            definition: 'This is an example definition 1.',
            tags: ['tag1', 'tag2'],
            fsrs: undefined,
          },
        ] as DbCard[],
    });
  }

  updateCard = action('updateCard') as CardsService['updateCard'];
}

const meta = {
  component: SearchCardsButtonComponent,
  decorators: [
    applicationConfig({
      providers: [{ provide: CardsService, useClass: MockCardsService }],
    }),
  ],
  parameters: {
    a11y: { test: 'todo' },
  },
} satisfies Meta<SearchCardsButtonComponent>;

export default meta;

export const Default = {} satisfies StoryObj<SearchCardsButtonComponent>;
