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
    listAriaLabel: 'Cards List',
    cards: [
      {
        id: '1',
        term: 'Example Term',
        fullTerm: 'Example Full Term',
        definition: 'This is an example definition.',
        tags: ['tag1', 'tag2'],
        fsrs: undefined,
        stability: 2,
      },
      {
        id: '2',
        term: 'Second Term',
        fullTerm: 'Second Full Term',
        definition: 'Another example definition.',
        tags: ['tag3'],
        fsrs: undefined,
        stability: 10,
      },
      {
        id: '3',
        term: 'Third Term',
        fullTerm: 'Third Full Term',
        definition: 'Yet another example definition.',
        tags: [],
        fsrs: undefined,
        stability: 80,
      },
      {
        id: '4',
        term: 'Fourth Term',
        fullTerm: 'Fourth Full Term',
        definition: 'More example definitions.',
        tags: ['tag1'],
        fsrs: undefined,
        stability: undefined,
      },
    ],
  },
  decorators: [
    applicationConfig({
      providers: [{ provide: CardsService, useClass: MockCardsService }],
    }),
  ],
  parameters: {
    a11y: { test: 'todo' },
  },
} satisfies Meta<CardsListComponent>;

export default meta;

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
