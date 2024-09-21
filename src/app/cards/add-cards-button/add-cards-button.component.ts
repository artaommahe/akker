import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { DialogComponent } from '../../ui/dialog/dialog.component';
import { IconComponent } from '../../ui/icon/icon';
import { AddCardsComponent } from '../add-cards/add-cards.component';

@Component({
  selector: 'app-add-cards-button',
  template: `
    <button
      class="fixed bottom-16 right-6 flex items-center justify-center rounded-full bg-action-primary shadow-md"
      title="Add"
      (click)="showAddCardsDialog.set(true)"
    >
      <app-icon class="size-10 text-primary" name="plusInCircle" />
    </button>

    <app-dialog [open]="showAddCardsDialog()" (close)="showAddCardsDialog.set(false)">
      <ng-template>
        <app-add-cards (close)="showAddCardsDialog.set(false)" />
      </ng-template>
    </app-dialog>
  `,
  imports: [IconComponent, AddCardsComponent, DialogComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCardsButtonComponent {
  showAddCardsDialog = signal(false);
}
