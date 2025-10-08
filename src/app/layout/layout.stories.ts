import { type Meta, type StoryObj } from '@storybook/angular';

import { LayoutComponent } from './layout.component';

const meta = {
  component: LayoutComponent,
  parameters: {
    layout: 'fullscreen',
  },
  render: () => ({
    template: `
      <app-layout>
        <div class="p-8 text-center text-xl">
          This is some static child content inside the layout.
        </div>
      </app-layout>
    `,
  }),
} satisfies Meta<LayoutComponent>;

export default meta;

export const Default = {} satisfies StoryObj<LayoutComponent>;
