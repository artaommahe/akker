import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { action } from 'storybook/actions';

import { CardsService, type NewCard } from '../cards.service';
import { AddCardsComponent } from './add-cards.component';

class MockCardsService {
  addCards(cards: NewCard[]) {
    action('addCards')(cards);
  }
}

const meta = {
  component: AddCardsComponent,
  decorators: [
    applicationConfig({
      providers: [{ provide: CardsService, useClass: MockCardsService }],
    }),
  ],
  parameters: {
    a11y: { test: 'todo' },
  },
  render: args => ({
    template: `
      <div class="h-[400px]">
        <app-add-cards ${argsToTemplate(args)}></app-add-cards>
      </div>
    `,
    props: args,
  }),
} satisfies Meta<AddCardsComponent>;

export default meta;

export const Default = {
  args: {},
} satisfies StoryObj<AddCardsComponent>;
