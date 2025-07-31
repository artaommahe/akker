import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { DialogComponent } from '../../ui/dialog/dialog.component';
import { SeedDetailsComponent, type SeedDetailsSeed } from '../seed-details/seed-details.component';
import { SeedsService } from '../seeds.service';

@Component({
  selector: 'app-seed-details-dialog',
  template: `
    <app-dialog [open]="open()" (dismiss)="dismiss.emit()">
      <ng-template>
        @defer (when open()) {
          @if (seed(); as seed) {
            <app-seed-details
              [seed]="seed"
              (dismiss)="dismiss.emit()"
              (remove)="onRemoveSeed(seed.name)"
              (update)="onUpdateSeed(seed.name, $event)"
            />
          }
        } @loading {
          <p>Loading...</p>
        }
      </ng-template>
    </app-dialog>
  `,
  imports: [DialogComponent, SeedDetailsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedDetailsDialogComponent {
  private seedsService = inject(SeedsService);

  open = input.required<boolean>();
  seed = input.required<SeedDetailsSeed | null>();
  dismiss = output();

  onRemoveSeed(name: string) {
    this.seedsService.removeSeeds([name]);
    this.dismiss.emit();
  }

  onUpdateSeed(name: string, value: Partial<SeedDetailsSeed>) {
    this.seedsService.updateSeed(name, value);
    this.dismiss.emit();
  }
}
