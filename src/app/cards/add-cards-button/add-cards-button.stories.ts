import { type Meta, type StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { action } from 'storybook/actions';

import { CardsService, type NewCard } from '../cards.service';
import { AddCardsButtonComponent } from './add-cards-button.component';

class MockCardsService {
  addCards(cards: NewCard[]) {
    action('addCards')(cards);
  }
}

const meta = {
  component: AddCardsButtonComponent,
  decorators: [
    applicationConfig({
      providers: [{ provide: CardsService, useClass: MockCardsService }],
    }),
  ],
  parameters: {
    a11y: { test: 'todo' },
  },
} satisfies Meta<AddCardsButtonComponent>;

export default meta;

export const Default = {
  args: {},
} satisfies StoryObj<AddCardsButtonComponent>;
