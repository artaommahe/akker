import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { IconComponent } from '../../ui/icon/icon';
import { AddTermsDialogComponent } from '../add-terms-dialog/add-terms-dialog.component';

@Component({
  selector: 'app-add-terms-button',
  template: `
    <button
      class="fixed bottom-16 right-6 flex items-center justify-center rounded-full bg-action-primary shadow-md"
      title="Add"
      (click)="showAddTermsDialog.set(true)"
    >
      <app-icon class="size-10 text-primary" name="plusInCircle" />
    </button>

    <app-add-terms-dialog [open]="showAddTermsDialog()" (close)="showAddTermsDialog.set(false)" />
  `,
  imports: [IconComponent, AddTermsDialogComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTermsButtonComponent {
  showAddTermsDialog = signal(false);
}
