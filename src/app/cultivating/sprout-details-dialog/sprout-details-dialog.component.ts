import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { BarnService } from '../../barn/barn.service';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { SproutDetailsComponent, type SproutDetailsSprout } from '../sprout-details/sprout-details.component';

@Component({
  selector: 'app-sprout-details-dialog',
  template: `
    <app-dialog (close)="close.emit()">
      <app-sprout-details
        [sprout]="sprout()"
        (cancel)="close.emit()"
        (remove)="onRemoveSprout(sprout().id)"
        (update)="onUpdateSprout(sprout().id, $event)"
      />
    </app-dialog>
  `,
  imports: [DialogComponent, SproutDetailsComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SproutDetailsDialogComponent {
  private barnService = inject(BarnService);

  sprout = input.required<SproutDetailsSprout>();

  close = output();

  onRemoveSprout(id: string) {
    this.barnService.removeSprout(id);
    this.close.emit();
  }

  onUpdateSprout(id: string, value: Partial<SproutDetailsSprout>) {
    this.barnService.updateSprout(id, value);
    this.close.emit();
  }
}
