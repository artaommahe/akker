import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';

import { ModalComponent } from './modal.component';

const meta = {
  component: ModalComponent,
  args: {
    open: true,
  },
  render: args => ({
    template: `
      <app-modal ${argsToTemplate(args)}>
        <ng-template>
          <div class="p-8 text-center text-xl">
            Modal content
          </div>
        </ng-template>
      </app-modal>
    `,
    props: args,
  }),
  // there is an issue in `compodoc` that it doesn't treat aliased input signals as inputs
  // so storybook doesn't generate proper arg types
  // https://github.com/storybookjs/storybook/issues/29697
} satisfies Meta<ModalComponent & { open: boolean }>;

export default meta;

export const Default = {} satisfies StoryObj<ModalComponent>;
