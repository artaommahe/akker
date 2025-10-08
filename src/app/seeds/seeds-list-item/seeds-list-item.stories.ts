import { type Meta, type StoryObj } from '@storybook/angular';

import { SeedsListItemComponent } from './seeds-list-item.component';

const meta = {
  component: SeedsListItemComponent,
  parameters: {
    a11y: { test: 'todo' },
  },
} satisfies Meta<SeedsListItemComponent>;

export default meta;

export const Default = {
  args: {
    seed: { name: 'snoep', count: 3 },
  },
} satisfies StoryObj<SeedsListItemComponent>;
