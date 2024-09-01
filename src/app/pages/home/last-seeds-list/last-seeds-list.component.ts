import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { BarnService } from '../../../barn/barn.service';
import { SeedDetailsDialogComponent } from '../../../planting/seed-details-dialog/seed-details-dialog.component';
import { type SeedDetailsSeed } from '../../../planting/seed-details/seed-details.component';
import { SeedsListItemComponent } from '../../../planting/seeds-list-item/seeds-list-item.component';

@Component({
  selector: 'app-last-seeds-list',
  template: `
    <section>
      <h2 class="text-lg text-secondary">Last seeds</h2>

      <ul class="flex flex-col gap-2">
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
      (close)="closeSeedDetailsDialog()"
    />
  `,
  imports: [SeedDetailsDialogComponent, SeedsListItemComponent],
  standalone: true,
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
