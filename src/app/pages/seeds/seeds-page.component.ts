import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { BarnService } from '../../barn/barn.service';
import { AddTermsButtonComponent } from '../../planting/add-terms-button/add-terms-button.component';
import { SeedDetailsDialogComponent } from '../../planting/seed-details-dialog/seed-details-dialog.component';
import type { SeedDetailsSeed } from '../../planting/seed-details/seed-details.component';
import { SeedsListComponent } from '../../planting/seeds-list/seeds-list.component';

@Component({
  selector: 'app-seeds-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-seeds-list [seeds]="seeds() ?? []" (showDetails)="seedDetailsDialog.set({ open: true, seed: $event })" />

      <app-add-terms-button />

      <app-seed-details-dialog
        [open]="seedDetailsDialog().open"
        [seed]="seedDetailsDialog().seed"
        (close)="closeSeedDetailsDialog()"
      />
    </div>
  `,
  imports: [SeedsListComponent, SeedDetailsDialogComponent, AddTermsButtonComponent],
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
