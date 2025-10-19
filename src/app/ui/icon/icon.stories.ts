import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';

import { globalIcons } from './global-icons';
import { IconComponent } from './icon.component';

const iconNames = Object.keys(globalIcons);

const meta = {
  component: IconComponent,
  argTypes: {
    name: {
      control: 'select',
      options: iconNames,
    },
  },
} satisfies Meta<IconComponent>;

export default meta;

export const Default = {
  args: {
    name: iconNames[0],
  },
  render: args => ({
    template: `<app-icon class="size-5" ${argsToTemplate(args)} />`,
    props: args,
  }),
} satisfies StoryObj<IconComponent>;

export const AllIcons = {
  parameters: {
    a11y: { test: 'todo' },
  },
  render: () => ({
    template: `
      <div class="grid grid-cols-6 gap-6">
        ${iconNames
          .map(
            name => `
              <div class="flex flex-col items-center gap-2">
                <app-icon class="size-5" [name]="'${name}'" />
                <span class="text-xs">${name}</span>
              </div>
            `,
          )
          .join('')}
      </div>
    `,
    props: {},
  }),
} satisfies StoryObj<IconComponent>;
