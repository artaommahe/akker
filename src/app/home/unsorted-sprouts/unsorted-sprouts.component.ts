import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { BarnService } from '../../barn/barn.service';
import { SproutDetailsDialogComponent } from '../../cultivating/sprout-details-dialog/sprout-details-dialog.component';
import { type SproutDetailsSprout } from '../../cultivating/sprout-details/sprout-details.component';

@Component({
  selector: 'app-unsorted-sprouts',
  template: `
    @if (someUnsortedSprouts().length > 0) {
      <section>
        <h2 class="text-lg text-secondary">Unsorted sprouts ({{ unsortedSproutsAmount() }})</h2>

        <ul class="columns-2 gap-4">
          @for (sprout of someUnsortedSprouts(); track sprout.id) {
            <li>
              <button class="w-full truncate px-2 py-1 text-left" (click)="sproutDetails.set(sprout)">
                {{ sprout.term }}
              </button>
            </li>
          }
        </ul>
      </section>

      @if (sproutDetails(); as sprout) {
        <app-sprout-details-dialog [sprout]="sprout" (close)="sproutDetails.set(null)" />
      }
    }
  `,
  imports: [SproutDetailsDialogComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsortedSproutsComponent {
  private barnService = inject(BarnService);
  private unsortedSprouts = computed(() => this.barnService.sprouts()?.filter(sprout => !sprout.definition));

  unsortedSproutsAmount = computed(() => this.unsortedSprouts()?.length ?? 0);
  someUnsortedSprouts = computed(() => this.unsortedSprouts()?.slice(0, someUnsortedSproutsAmount) ?? []);

  sproutDetails = signal<SproutDetailsSprout | null>(null);
}

const someUnsortedSproutsAmount = 10;
