import { type Meta, type StoryObj } from '@storybook/angular';

import { SeedsListItemComponent } from './seeds-list-item.component';

const meta = {
  component: SeedsListItemComponent,
  parameters: {},
} satisfies Meta<SeedsListItemComponent>;

export default meta;

export const Default: StoryObj<SeedsListItemComponent> = {
  args: {
    seed: { name: 'snoep', count: 3 },
  },
};
