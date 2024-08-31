import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { BarnService } from '../../barn/barn.service';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { SeedDetailsComponent, type SeedDetailsSeed } from '../seed-details/seed-details.component';

@Component({
  selector: 'app-seed-details-dialog',
  template: `
    <app-dialog (close)="close.emit()">
      <app-seed-details
        [seed]="seed()"
        (cancel)="close.emit()"
        (remove)="onRemoveSeed(seed().name)"
        (update)="onUpdateSeed(seed().name, $event)"
      />
    </app-dialog>
  `,
  imports: [DialogComponent, SeedDetailsComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedDetailsDialogComponent {
  private barnService = inject(BarnService);

  seed = input.required<SeedDetailsSeed>();

  close = output();

  onRemoveSeed(name: string) {
    this.barnService.removeSeed(name);
    this.close.emit();
  }

  onUpdateSeed(name: string, value: Partial<SeedDetailsSeed>) {
    this.barnService.updateSeed(name, value);
    this.close.emit();
  }
}
