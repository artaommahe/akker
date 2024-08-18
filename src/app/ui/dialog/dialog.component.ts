import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-dialog',
  template: `
    <div class="fixed inset-0 bg-primary p-5">
      <!-- TODO: ui/button -->
      <button class="absolute right-2 top-2 p-2" (click)="close.emit()">
        <app-icon class="size-6 text-secondary" name="crossInCircle" />
      </button>

      <ng-content></ng-content>
    </div>
  `,
  imports: [IconComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  close = output();
}
