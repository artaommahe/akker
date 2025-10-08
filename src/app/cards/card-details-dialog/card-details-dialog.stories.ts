import { applicationConfig } from '@storybook/angular';
import { type Meta, type StoryObj } from '@storybook/angular';
import { action } from 'storybook/actions';

import { CardsService } from '../cards.service';
import { CardDetailsDialogComponent } from './card-details-dialog.component';

class MockCardsService {
  removeCard = action('removeCard');
  updateCard = action('updateCard');
}

const meta = {
  component: CardDetailsDialogComponent,
  decorators: [
    applicationConfig({
      providers: [{ provide: CardsService, useClass: MockCardsService }],
    }),
  ],
  parameters: {
    a11y: { test: 'todo' },
  },
} satisfies Meta<CardDetailsDialogComponent>;

export default meta;

export const Default = {
  args: {
    open: true,
    card: {
      id: '1',
      term: 'Example Term',
      fullTerm: 'Example Full Term',
      definition: 'This is an example definition.',
      tags: ['tag1', 'tag2'],
      fsrs: undefined,
    },
  },
} satisfies StoryObj<CardDetailsDialogComponent>;
