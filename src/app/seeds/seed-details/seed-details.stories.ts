import { type Meta, type StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { action } from 'storybook/actions';

import { SeedsService } from '../seeds.service';
import { SeedDetailsComponent } from './seed-details.component';

class MockSeedsService implements Pick<SeedsService, 'removeSeeds' | 'updateSeed'> {
  removeSeeds = action('removeSeeds');
  updateSeed = action('updateSeed');
}

const meta = {
  component: SeedDetailsComponent,
  decorators: [
    applicationConfig({
      providers: [{ provide: SeedsService, useClass: MockSeedsService }],
    }),
  ],
  parameters: {
    a11y: { test: 'todo' },
  },
} satisfies Meta<SeedDetailsComponent>;

export default meta;

export const Default: StoryObj<SeedDetailsComponent> = {
  args: {
    seed: { name: 'snoep' },
  },
};
