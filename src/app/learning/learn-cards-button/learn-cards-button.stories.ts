import { type Meta, type StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { action } from 'storybook/actions';

import { CardsService } from '../../cards/cards.service';
import { LearnCardsButtonComponent } from './learn-cards-button.component';

class MockCardsService implements Pick<CardsService, 'updateCard'> {
  updateCard = action('updateCard');
}

const meta = {
  component: LearnCardsButtonComponent,
  decorators: [
    applicationConfig({
      providers: [{ provide: CardsService, useClass: MockCardsService }],
    }),
  ],
  parameters: {},
} satisfies Meta<LearnCardsButtonComponent>;

export default meta;

export const Default: StoryObj<LearnCardsButtonComponent> = {
  args: {
    cards: [
      { id: '1', term: 'appel', fullTerm: 'de appel', definition: 'apple' },
      { id: '2', term: 'banaan', fullTerm: 'de banaan', definition: 'banana' },
      { id: '3', term: 'huis', fullTerm: 'het huis', definition: 'house' },
      { id: '4', term: 'fiets', fullTerm: '', definition: '' },
      { id: '5', term: 'water', fullTerm: 'het water', definition: 'water' },
      { id: '6', term: 'zon', fullTerm: 'de zon', definition: 'sun' },
    ],
  },
};
