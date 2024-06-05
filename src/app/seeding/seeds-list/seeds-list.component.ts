import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { BarnService } from '../../barn/barn.service';

@Component({
  selector: 'app-seeds-list',
  template: `
    <ul class="flex flex-col gap-2">
      @for (seed of seeds(); track seed.name) {
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
  private barn = inject(BarnService);

  seeds = computed(() =>
    Object.values(this.barn.seeds()).toSorted((a, b) => b.count - a.count || b.lastAddedAt - a.lastAddedAt),
  );
}
