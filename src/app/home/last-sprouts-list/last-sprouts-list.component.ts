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
            <app-sprouts-list-item [sprout]="sprout" (showDetails)="sproutDetailsDialog.set({ open: true, sprout })" />
          </li>
        }
      </ul>
    </section>

    <app-sprout-details-dialog
      [open]="sproutDetailsDialog().open"
      [sprout]="sproutDetailsDialog().sprout"
      (close)="closeSproutDetailsDialog()"
    />
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
  sproutDetailsDialog = signal<{ open: boolean; sprout: SproutDetailsSprout | null }>({ open: false, sprout: null });

  closeSproutDetailsDialog() {
    this.sproutDetailsDialog.update(value => ({ ...value, open: false }));
  }
}

const lastSproutsAmount = 10;
