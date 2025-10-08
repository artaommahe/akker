import { type Meta, type StoryObj } from '@storybook/angular';
import { State } from 'ts-fsrs';

import { CardStatsComponent } from './card-stats.component';

const meta = {
  component: CardStatsComponent,
  parameters: {},
} satisfies Meta<CardStatsComponent>;

export default meta;

export const Default: StoryObj<CardStatsComponent> = {
  args: {
    fsrs: {
      card: {
        state: State.Review,
        due: '2025-10-09T10:00:00.000Z',
        last_review: '2025-10-08T10:00:00.000Z',
        reps: 12,
        lapses: 2,
        stability: 3.5,
        difficulty: 2.1,
        elapsed_days: 1,
        scheduled_days: 3,
      },
    },
  },
};
