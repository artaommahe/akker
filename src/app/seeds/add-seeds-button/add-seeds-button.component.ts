import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { DialogComponent } from '../../ui/dialog/dialog.component';
import { IconComponent } from '../../ui/icon/icon.component';
import { AddSeedsComponent } from '../add-seeds/add-seeds.component';

@Component({
  selector: 'app-add-seeds-button',
  template: `
    <button
      class="bg-action-primary fixed right-6 bottom-16 flex items-center justify-center rounded-full shadow-md"
      title="Add seeds"
      (click)="showAddSeedsDialog.set(true)"
    >
      <app-icon class="text-primary size-10" name="plusInCircle" />
    </button>

    @defer {
      <app-dialog [open]="showAddSeedsDialog()" (dismiss)="showAddSeedsDialog.set(false)">
        <ng-template>
          <app-add-seeds (dismiss)="showAddSeedsDialog.set(false)" />
        </ng-template>
      </app-dialog>
    }
  `,
  imports: [IconComponent, AddSeedsComponent, DialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSeedsButtonComponent {
  showAddSeedsDialog = signal(false);
}
