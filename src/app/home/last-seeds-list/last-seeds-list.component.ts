import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BarnService } from '../../barn/barn.service';

@Component({
  selector: 'app-last-seeds-list',
  template: `
    <section>
      <h2 class="text-lg text-secondary">Last seeds</h2>

      <ul class="columns-2 gap-4">
        @for (seed of lastAddedSeeds(); track seed.name) {
          <li class="w-full truncate px-2 py-1">
            {{ seed.name }}
          </li>
        }
      </ul>
    </section>
  `,
  imports: [],
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
}

const lastSeedsCount = 10;
