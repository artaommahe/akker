import { type Meta, type StoryObj } from '@storybook/angular';

import { CardRecallLevelComponent } from './card-recall-level.component';

const meta = {
  component: CardRecallLevelComponent,
} satisfies Meta<CardRecallLevelComponent>;

export default meta;

export const Bad = {
  args: {
    stability: 1,
  },
} satisfies StoryObj<CardRecallLevelComponent>;

export const Good = {
  args: {
    stability: 10,
  },
} satisfies StoryObj<CardRecallLevelComponent>;

export const Excellent = {
  args: {
    stability: 100,
  },
} satisfies StoryObj<CardRecallLevelComponent>;

export const None = {
  args: {
    stability: undefined,
  },
} satisfies StoryObj<CardRecallLevelComponent>;
