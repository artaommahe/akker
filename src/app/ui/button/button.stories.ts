import { type Meta, type StoryObj } from '@storybook/angular';

import { ButtonDirective } from './button';

const meta = {
  component: ButtonDirective,
  render: args => ({
    args,
    // there is an issue in `compodoc` that it doesn't treat aliased input signals as inputs
    // so `${argsToTemplate(args)}` can't properly map from `type` to `appButtonType`
    // https://github.com/storybookjs/storybook/issues/29697
    template: `
      <button
        appButton
        appButtonType="${args.type}"
        ${args.semantic && `appButtonSemantic="${args.semantic}"`}
      >
        Button
      </button>
    `,
  }),
  argTypes: {
    // there is an issue in `compodoc` that it doesn't treat aliased input signals as inputs
    // so storybook doesn't generate proper arg types
    // https://github.com/storybookjs/storybook/issues/29697
    type: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    semantic: {
      control: 'select',
      options: [undefined, 'success', 'warning', 'danger'],
    },
  },
} satisfies Meta<ButtonDirective>;

export default meta;

export const Default = {
  args: {
    type: 'primary',
  },
} satisfies StoryObj<ButtonDirective>;
