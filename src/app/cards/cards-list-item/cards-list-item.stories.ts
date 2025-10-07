import { type Meta, type StoryObj } from '@storybook/angular';

import { CardsListItemComponent } from './cards-list-item.component';

const meta = {
  component: CardsListItemComponent,
} satisfies Meta<CardsListItemComponent>;

export default meta;

export const Default: StoryObj<CardsListItemComponent> = {
  args: {
    card: {
      id: '1',
      term: 'Example Term',
      stability: 5,
    },
  },
};

export const NoStability: StoryObj<CardsListItemComponent> = {
  args: {
    card: {
      id: '2',
      term: 'No Stability',
      stability: undefined,
    },
  },
};
