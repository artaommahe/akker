import { type Meta, type StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { action } from 'storybook/actions';

import { SeedsService } from '../seeds.service';
import { SeedsListComponent } from './seeds-list.component';

class MockSeedsService implements Pick<SeedsService, 'removeSeeds' | 'updateSeed'> {
  removeSeeds = action('removeSeeds');
  updateSeed = action('updateSeed');
}

const meta = {
  component: SeedsListComponent,
  args: {
    listAriaLabel: 'Last seeds',
    listAriaLabelledBy: '',
    isLoading: false,
    loadingError: undefined,
  },
  decorators: [
    applicationConfig({
      providers: [{ provide: SeedsService, useClass: MockSeedsService }],
    }),
  ],
  parameters: {},
} satisfies Meta<SeedsListComponent>;

export default meta;

export const Default: StoryObj<SeedsListComponent> = {
  args: {
    seeds: [
      { name: 'snoep', count: 3 },
      { name: 'doel', count: 2 },
      { name: 'hemel', count: 1 },
    ],
  },
};

export const Loading: StoryObj<SeedsListComponent> = {
  args: {
    seeds: [],
    isLoading: true,
  },
};

export const LoadingError: StoryObj<SeedsListComponent> = {
  args: {
    seeds: [],
    loadingError: new Error('Failed to load seeds'),
  },
};
