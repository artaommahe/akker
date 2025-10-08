import { type Meta, type StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';

import { globalIcons } from './global-icons';
import { IconComponent } from './icon.component';

const iconNames = Object.keys(globalIcons);

const meta = {
  component: IconComponent,
  parameters: {},
  argTypes: {
    name: {
      control: 'select',
      options: iconNames,
    },
  },
} satisfies Meta<IconComponent>;

export default meta;

export const Default: StoryObj<IconComponent> = {
  args: {
    name: iconNames[0],
  },
  render: args => ({
    template: `<app-icon class="size-5" ${argsToTemplate(args)} />`,
    props: args,
  }),
};

export const AllIcons: StoryObj<IconComponent> = {
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
};
