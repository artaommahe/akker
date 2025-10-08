import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';

import { InputDirective } from './input';

const meta = {
  component: InputDirective,
  render: args => ({
    template: `
  <input class="w-full" appInput ${argsToTemplate(args)} placeholder="Type something..." />
    `,
    props: args,
  }),
} satisfies Meta<InputDirective>;

export default meta;

export const Default = {} satisfies StoryObj<InputDirective>;

export const Textarea = {
  render: args => ({
    template: `
  <textarea class="w-full" appInput ${argsToTemplate(args)} placeholder="Type something..." rows="4"></textarea>
    `,
    props: args,
  }),
} satisfies StoryObj<InputDirective>;
