import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { BarnService } from '../../barn/barn.service';
import { SproutDetailsDialogComponent } from '../../cultivating/sprout-details-dialog/sprout-details-dialog.component';
import type { SproutDetailsSprout } from '../../cultivating/sprout-details/sprout-details.component';
import { SproutsListItemComponent } from '../../cultivating/sprouts-list-item/sprouts-list-item.component';

@Component({
  selector: 'app-last-sprouts-list',
  template: `
    <section class="flex flex-col gap-2">
      <h2 class="text-lg text-secondary">Last sprouts</h2>

      <ul class="flex flex-col gap-2">
        @for (sprout of lastSprouts(); track sprout.id) {
          <li>
            <app-sprouts-list-item [sprout]="sprout" (showDetails)="sproutDetails.set(sprout)" />
          </li>
        }
      </ul>
    </section>

    @if (sproutDetails(); as sprout) {
      <app-sprout-details-dialog [sprout]="sprout" (close)="sproutDetails.set(null)" />
    }
  `,
  imports: [SproutsListItemComponent, SproutDetailsDialogComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastSproutsListComponent {
  private barnService = inject(BarnService);

  lastSprouts = computed(() =>
    this.barnService
      .sprouts()
      ?.toSorted((a, b) => b.addedAt.localeCompare(a.addedAt))
      .slice(0, lastSproutsAmount),
  );
  sproutDetails = signal<SproutDetailsSprout | null>(null);
}

const lastSproutsAmount = 10;
