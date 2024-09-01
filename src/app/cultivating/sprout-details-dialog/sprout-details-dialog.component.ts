import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { BarnService } from '../../barn/barn.service';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { SproutDetailsComponent, type SproutDetailsSprout } from '../sprout-details/sprout-details.component';

@Component({
  selector: 'app-sprout-details-dialog',
  template: `
    <app-dialog [open]="open()" (close)="close.emit()">
      <ng-template>
        @if (sprout(); as sprout) {
          <app-sprout-details
            [sprout]="sprout"
            (cancel)="close.emit()"
            (remove)="onRemoveSprout(sprout.id)"
            (update)="onUpdateSprout(sprout.id, $event)"
          />
        }
      </ng-template>
    </app-dialog>
  `,
  imports: [DialogComponent, SproutDetailsComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SproutDetailsDialogComponent {
  private barnService = inject(BarnService);

  open = input.required<boolean>();
  sprout = input.required<SproutDetailsSprout | null>();
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
