import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { BarnService } from '../../barn/barn.service';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { SeedDetailsComponent, type SeedDetailsSeed } from '../seed-details/seed-details.component';

@Component({
  selector: 'app-seed-details-dialog',
  template: `
    <app-dialog [open]="open()" (close)="close.emit()">
      <ng-template>
        @if (seed(); as seed) {
          <app-seed-details
            [seed]="seed"
            (cancel)="close.emit()"
            (remove)="onRemoveSeed(seed.name)"
            (update)="onUpdateSeed(seed.name, $event)"
          />
        }
      </ng-template>
    </app-dialog>
  `,
  imports: [DialogComponent, SeedDetailsComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedDetailsDialogComponent {
  private barnService = inject(BarnService);

  open = input.required<boolean>();
  seed = input.required<SeedDetailsSeed | null>();
  close = output();

  onRemoveSeed(name: string) {
    this.barnService.removeSeeds([name]);
    this.close.emit();
  }

  onUpdateSeed(name: string, value: Partial<SeedDetailsSeed>) {
    this.barnService.updateSeed(name, value);
    this.close.emit();
  }
}
