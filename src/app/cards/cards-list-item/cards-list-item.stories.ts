import { type Meta, type StoryObj } from '@storybook/angular';

import { CardsListItemComponent } from './cards-list-item.component';

const meta = {
  component: CardsListItemComponent,
  parameters: {
    a11y: { test: 'todo' },
  },
} satisfies Meta<CardsListItemComponent>;

export default meta;

export const Default = {
  args: {
    card: {
      id: '1',
      term: 'Example Term',
      stability: 5,
    },
  },
} satisfies StoryObj<CardsListItemComponent>;

export const NoStability = {
  args: {
    card: {
      id: '2',
      term: 'No Stability',
      stability: undefined,
    },
  },
} satisfies StoryObj<CardsListItemComponent>;
