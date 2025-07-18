import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SeedsService } from 'src/app/seeds/seeds.service';

import { AddSeedsButtonComponent } from '../../seeds/add-seeds-button/add-seeds-button.component';
import { SeedDetailsDialogComponent } from '../../seeds/seed-details-dialog/seed-details-dialog.component';
import type { SeedDetailsSeed } from '../../seeds/seed-details/seed-details.component';
import { SeedsListComponent } from './seeds-list/seeds-list.component';

@Component({
  selector: 'app-seeds-page',
  template: `
    <div class="flex flex-col gap-4">
      @switch (newSeeds.status()) {
        @case ('loading') {
          <p>Loading...</p>
        }
        @case ('error') {
          <p class="text-semantic-danger">Error loading seeds list:</p>
          <p>{{ newSeeds.error() }}</p>
        }
        @default {
          <app-seeds-list
            [seeds]="newSeeds.value() ?? []"
            (showDetails)="seedDetailsDialog.set({ open: true, seed: $event })"
          />
        }
      }

      <app-add-seeds-button />

      <app-seed-details-dialog
        [open]="seedDetailsDialog().open"
        [seed]="seedDetailsDialog().seed"
        (dismiss)="closeSeedDetailsDialog()"
      />
    </div>
  `,
  imports: [SeedsListComponent, SeedDetailsDialogComponent, AddSeedsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedsPageComponent {
  private seedsService = inject(SeedsService);

  newSeeds = this.seedsService.getSeeds();
  seedDetailsDialog = signal<{ open: boolean; seed: SeedDetailsSeed | null }>({ open: false, seed: null });

  closeSeedDetailsDialog() {
    this.seedDetailsDialog.update(value => ({ ...value, open: false }));
  }
}
