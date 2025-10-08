import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';

import { DialogComponent } from './dialog.component';

const meta = {
  component: DialogComponent,
  args: {
    open: true,
  },
  render: args => ({
    template: `
      <app-dialog ${argsToTemplate(args)}>
        <ng-template>
          <div class="p-8 text-center text-xl">
            This is some static child content inside the dialog.
          </div>
        </ng-template>
      </app-dialog>
    `,
    props: args,
  }),
} satisfies Meta<DialogComponent>;

export default meta;

export const Default = {} satisfies StoryObj<DialogComponent>;
