import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { DialogComponent } from '../../ui/dialog/dialog.component';
import { IconComponent } from '../../ui/icon/icon';
import { AddSeedsComponent } from '../add-seeds/add-seeds.component';

@Component({
  selector: 'app-add-seeds-button',
  template: `
    <button
      class="fixed bottom-16 right-6 flex items-center justify-center rounded-full bg-action-primary shadow-md"
      title="Add"
      (click)="showAddSeedsDialog.set(true)"
    >
      <app-icon class="size-10 text-primary" name="plusInCircle" />
    </button>

    <app-dialog [open]="showAddSeedsDialog()" (close)="showAddSeedsDialog.set(false)">
      <ng-template>
        <app-add-seeds (close)="showAddSeedsDialog.set(false)" />
      </ng-template>
    </app-dialog>
  `,
  imports: [IconComponent, AddSeedsComponent, DialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSeedsButtonComponent {
  showAddSeedsDialog = signal(false);
}
