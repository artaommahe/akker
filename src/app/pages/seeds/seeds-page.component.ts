import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { BarnService } from '../../barn/barn.service';
import { AddSeedsButtonComponent } from '../../seeds/add-seeds-button/add-seeds-button.component';
import { SeedDetailsDialogComponent } from '../../seeds/seed-details-dialog/seed-details-dialog.component';
import type { SeedDetailsSeed } from '../../seeds/seed-details/seed-details.component';
import { SeedsListComponent } from './seeds-list/seeds-list.component';

@Component({
  selector: 'app-seeds-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-seeds-list [seeds]="seeds() ?? []" (showDetails)="seedDetailsDialog.set({ open: true, seed: $event })" />

      <app-add-seeds-button />

      <app-seed-details-dialog
        [open]="seedDetailsDialog().open"
        [seed]="seedDetailsDialog().seed"
        (close)="closeSeedDetailsDialog()"
      />
    </div>
  `,
  imports: [SeedsListComponent, SeedDetailsDialogComponent, AddSeedsButtonComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedsPageComponent {
  private barnService = inject(BarnService);

  seeds = this.barnService.seeds;
  seedDetailsDialog = signal<{ open: boolean; seed: SeedDetailsSeed | null }>({ open: false, seed: null });

  closeSeedDetailsDialog() {
    this.seedDetailsDialog.update(value => ({ ...value, open: false }));
  }
}
