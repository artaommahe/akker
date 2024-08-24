import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { LearnCardsComponent } from '../learning/learn-cards.component';
import { IconComponent } from '../ui/icon/icon';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { UnsortedSproutsComponent } from './unsorted-sprouts/unsorted-sprouts.component';

@Component({
  selector: 'app-home-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-unsorted-sprouts />

      <app-learn-cards />

      <button class="absolute bottom-6 right-6" title="Add" (click)="showAddDialog.set(true)">
        <app-icon class="size-10 text-action-primary" name="plusInCircle" />
      </button>

      @if (showAddDialog()) {
        <app-add-dialog (close)="showAddDialog.set(false)" />
      }
    </div>
  `,
  imports: [UnsortedSproutsComponent, LearnCardsComponent, IconComponent, AddDialogComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  showAddDialog = signal(false);
}
