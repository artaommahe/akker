import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';

import { LearnCardsComponent } from './learn-cards.component';

const meta = {
  component: LearnCardsComponent,
  parameters: {
    a11y: { test: 'todo' },
  },
  render: args => ({
    template: `
      <div class="h-[600px]">
        <app-learn-cards ${argsToTemplate(args)}></app-learn-cards>
      </div>
    `,
    props: args,
  }),
} satisfies Meta<LearnCardsComponent>;

export default meta;

export const Default = {
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
} satisfies StoryObj<LearnCardsComponent>;
