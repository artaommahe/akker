import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';

import { ExpansionPanelComponent } from './expansion-panel.component';

const meta = {
  component: ExpansionPanelComponent,
  parameters: {
    a11y: { test: 'todo' },
  },
  render: args => ({
    template: `
      <app-expansion-panel ${argsToTemplate(args)}>
        Toggle panel

        <ng-template>
          <p class="text-secondary">Panel content goes here</p>
        </ng-template>
      </app-expansion-panel>
    `,
  }),
} satisfies Meta<ExpansionPanelComponent>;

export default meta;

export const Default = {} satisfies StoryObj<ExpansionPanelComponent>;
