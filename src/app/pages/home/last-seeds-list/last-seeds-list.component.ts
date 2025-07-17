import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SeedsService } from 'src/app/seeds/seeds.service';

import { SeedDetailsDialogComponent } from '../../../seeds/seed-details-dialog/seed-details-dialog.component';
import { type SeedDetailsSeed } from '../../../seeds/seed-details/seed-details.component';
import { SeedsListItemComponent } from '../../../seeds/seeds-list-item/seeds-list-item.component';

@Component({
  selector: 'app-last-seeds-list',
  template: `
    <section class="flex flex-col gap-2">
      <h2 class="text-secondary text-lg">Last seeds</h2>

      @switch (lastSeeds.status()) {
        @case ('loading') {
          <p>Loading...</p>
        }
        @case ('error') {
          <p class="text-semantic-danger">Error loading last seeds list:</p>
          <p>{{ lastSeeds.error() }}</p>
        }
        @default {
          <ul class="flex flex-col gap-2" aria-label="Last seeds list">
            @for (seed of lastSeeds.value(); track seed.name) {
              <li>
                <app-seeds-list-item [seed]="seed" (showDetails)="seedDetailsDialog.set({ open: true, seed })" />
              </li>
            }
          </ul>
        }
      }
    </section>

    <app-seed-details-dialog
      [open]="seedDetailsDialog().open"
      [seed]="seedDetailsDialog().seed"
      (dismiss)="closeSeedDetailsDialog()"
    />
  `,
  imports: [SeedDetailsDialogComponent, SeedsListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastSeedsListComponent {
  private seedsService = inject(SeedsService);

  lastSeeds = this.seedsService.getSeeds({ limit: lastSeedsCount });
  seedDetailsDialog = signal<{ open: boolean; seed: SeedDetailsSeed | null }>({ open: false, seed: null });

  closeSeedDetailsDialog() {
    this.seedDetailsDialog.update(value => ({ ...value, open: false }));
  }
}

const lastSeedsCount = 10;
