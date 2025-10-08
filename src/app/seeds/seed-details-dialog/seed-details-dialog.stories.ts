import { type Meta, type StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { action } from 'storybook/actions';

import { SeedsService } from '../seeds.service';
import { SeedDetailsDialogComponent } from './seed-details-dialog.component';

class MockSeedsService implements Pick<SeedsService, 'removeSeeds' | 'updateSeed'> {
  removeSeeds = action('removeSeeds');
  updateSeed = action('updateSeed');
}

const meta = {
  component: SeedDetailsDialogComponent,
  decorators: [
    applicationConfig({
      providers: [{ provide: SeedsService, useClass: MockSeedsService }],
    }),
  ],
  parameters: {
    a11y: { test: 'todo' },
  },
} satisfies Meta<SeedDetailsDialogComponent>;

export default meta;

export const Default: StoryObj<SeedDetailsDialogComponent> = {
  args: {
    open: true,
    seed: { name: 'snoep' },
  },
};
