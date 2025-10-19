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
  parameters: {
    a11y: { test: 'todo' },
  },
} satisfies Meta<SeedsListComponent>;

export default meta;

export const Default = {
  args: {
    seeds: [
      { name: 'snoep', count: 3 },
      { name: 'doel', count: 2 },
      { name: 'hemel', count: 1 },
    ],
  },
} satisfies StoryObj<SeedsListComponent>;

export const Loading = {
  args: {
    seeds: [],
    isLoading: true,
  },
} satisfies StoryObj<SeedsListComponent>;

export const LoadingError = {
  args: {
    seeds: [],
    loadingError: new Error('Failed to load seeds'),
  },
} satisfies StoryObj<SeedsListComponent>;
