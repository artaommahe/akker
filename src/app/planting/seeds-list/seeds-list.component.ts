import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Seed } from '../../barn/barn.service';

@Component({
  selector: 'app-seeds-list',
  template: `
    <ul class="flex flex-col gap-2">
      @for (seed of sortedSeeds(); track seed.name) {
        <li>
          <button class="flex w-full items-center gap-2 px-2 py-1 text-left" (click)="onShowDetails.emit(seed)">
            <span class="line-clamp-1 grow">{{ seed.name }}</span>
            <span class="shrink-0">{{ seed.count }}</span>
          </button>
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
  onShowDetails = output<Seed>();

  sortedSeeds = computed(() => this.seeds().toSorted((a, b) => b.count - a.count || b.lastAddedAt - a.lastAddedAt));
}
