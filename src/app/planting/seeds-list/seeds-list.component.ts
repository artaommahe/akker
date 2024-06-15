import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Seed } from '../../barn/barn.service';

@Component({
  selector: 'app-seeds-list',
  template: `
    <ul class="flex flex-col gap-2">
      @for (seed of sortedSeeds(); track seed.name) {
        <li class="flex items-center gap-2">
          <span class="grow line-clamp-1">{{ seed.name }}</span>
          <span class="shrink-0">{{ seed.count }}</span>
        </li>
      }
    </ul>
  `,
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedsListComponent {
  seeds = input.required<Seed[]>();

  sortedSeeds = computed(() => this.seeds().toSorted((a, b) => b.count - a.count || b.lastAddedAt - a.lastAddedAt));
}
