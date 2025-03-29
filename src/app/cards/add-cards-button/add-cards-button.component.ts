import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { DialogComponent } from '../../ui/dialog/dialog.component';
import { IconComponent } from '../../ui/icon/icon';
import { AddCardsComponent } from '../add-cards/add-cards.component';

@Component({
  selector: 'app-add-cards-button',
  template: `
    <button
      class="bg-action-primary fixed right-6 bottom-16 flex items-center justify-center rounded-full shadow-md"
      title="Add"
      (click)="showAddCardsDialog.set(true)"
    >
      <app-icon class="text-primary size-10" name="plusInCircle" />
    </button>

    <app-dialog [open]="showAddCardsDialog()" (dismiss)="showAddCardsDialog.set(false)">
      <ng-template>
        <app-add-cards (dismiss)="showAddCardsDialog.set(false)" />
      </ng-template>
    </app-dialog>
  `,
  imports: [IconComponent, AddCardsComponent, DialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCardsButtonComponent {
  showAddCardsDialog = signal(false);
}
