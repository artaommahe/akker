import { type Meta, type StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { action } from 'storybook/actions';

import { SeedsService } from '../seeds.service';
import { AddSeedsButtonComponent } from './add-seeds-button.component';

class MockSeedsService implements Pick<SeedsService, 'addSeeds'> {
  addSeeds = action('addSeeds') as SeedsService['addSeeds'];
}

const meta = {
  component: AddSeedsButtonComponent,
  decorators: [
    applicationConfig({
      providers: [{ provide: SeedsService, useClass: MockSeedsService }],
    }),
  ],
} satisfies Meta<AddSeedsButtonComponent>;

export default meta;

export const Default = {} satisfies StoryObj<AddSeedsButtonComponent>;
