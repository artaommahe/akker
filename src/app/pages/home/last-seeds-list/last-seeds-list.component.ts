import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { BarnService } from '../../../barn/barn.service';
import { SeedDetailsDialogComponent } from '../../../seeds/seed-details-dialog/seed-details-dialog.component';
import { type SeedDetailsSeed } from '../../../seeds/seed-details/seed-details.component';
import { SeedsListItemComponent } from '../../../seeds/seeds-list-item/seeds-list-item.component';

@Component({
  selector: 'app-last-seeds-list',
  template: `
    <section class="flex flex-col gap-2">
      <h2 class="text-secondary text-lg">Last seeds</h2>

      <ul class="flex flex-col gap-2" aria-label="Last seeds list">
        @for (seed of lastAddedSeeds(); track seed.name) {
          <li>
            <app-seeds-list-item [seed]="seed" (showDetails)="seedDetailsDialog.set({ open: true, seed })" />
          </li>
        }
      </ul>
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
  private barnService = inject(BarnService);

  lastAddedSeeds = computed(() =>
    this.barnService
      .seeds()
      ?.toSorted((a, b) => b.lastAddedAt.localeCompare(a.lastAddedAt))
      .slice(0, lastSeedsCount),
  );
  seedDetailsDialog = signal<{ open: boolean; seed: SeedDetailsSeed | null }>({ open: false, seed: null });

  closeSeedDetailsDialog() {
    this.seedDetailsDialog.update(value => ({ ...value, open: false }));
  }
}

const lastSeedsCount = 10;
