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
      fullTerm: 'Example Full Term',
      definition: 'This is an example definition.',
      tags: ['tag1', 'tag2'],
      fsrs: undefined,
    },
  },
} satisfies StoryObj<CardDetailsComponent>;
