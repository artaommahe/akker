import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { action } from 'storybook/actions';

import { SeedsService } from '../seeds.service';
import { AddSeedsComponent } from './add-seeds.component';

class MockSeedsService implements Pick<SeedsService, 'addSeeds'> {
  addSeeds = action('addSeeds') as SeedsService['addSeeds'];
}

const meta = {
  component: AddSeedsComponent,
  decorators: [
    applicationConfig({
      providers: [{ provide: SeedsService, useClass: MockSeedsService }],
    }),
  ],
  parameters: {
    a11y: { test: 'todo' },
  },
  render: args => ({
    template: `
      <div class="h-[400px]">
        <app-add-seeds ${argsToTemplate(args)}></app-add-seeds>
      </div>
    `,
    props: args,
  }),
} satisfies Meta<AddSeedsComponent>;

export default meta;

export const Default = {} satisfies StoryObj<AddSeedsComponent>;
