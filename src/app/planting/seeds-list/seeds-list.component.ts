import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { SeedsListItemComponent, type SeedsListItemSeed } from './seeds-list-item.component';

@Component({
  selector: 'app-seeds-list',
  template: `
    <div class="div flex flex-col gap-6">
      <div class="div flex gap-4">
        <section class="min-w-0 flex-grow">
          <h2 class="text-lg text-secondary">Top</h2>

          <ul class="flex flex-col gap-2">
            @for (seed of topSeeds(); track seed.name) {
              <li>
                <app-seeds-list-item [seed]="seed" (onShowDetails)="onShowDetails.emit($event)" />
              </li>
            }
          </ul>
        </section>

        <div class="w-px self-stretch border-l border-l-primary/10"></div>

        <section class="min-w-0 flex-grow">
          <h2 class="text-lg text-secondary">Last</h2>

          <ul class="flex flex-col gap-2">
            @for (seed of lastAddedSeeds(); track seed.name) {
              <li>
                <app-seeds-list-item [seed]="seed" (onShowDetails)="onShowDetails.emit($event)" />
              </li>
            }
          </ul>
        </section>
      </div>

      <!-- TODO: ui/expansion-panel -->
      <details>
        <summary class="text-lg">All seeds</summary>

        <ul class="flex flex-col gap-2">
          @for (seed of sortedSeeds(); track seed.name) {
            <li>
              <app-seeds-list-item [seed]="seed" (onShowDetails)="onShowDetails.emit($event)" />
            </li>
          }
        </ul>
      </details>
    </div>
  `,
  imports: [SeedsListItemComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedsListComponent {
  seeds = input.required<SeedsListSeed[]>();
  onShowDetails = output<SeedsListItemSeed>();

  sortedSeeds = computed(() =>
    this.seeds().toSorted((a, b) => b.count - a.count || b.lastAddedAt.localeCompare(a.lastAddedAt)),
  );
  topSeeds = computed(() => this.sortedSeeds().slice(0, topSeedsCount));
  lastAddedSeeds = computed(() =>
    this.seeds()
      .toSorted((a, b) => b.lastAddedAt.localeCompare(a.lastAddedAt))
      .slice(0, topSeedsCount),
  );
}

const topSeedsCount = 10;

export interface SeedsListSeed extends SeedsListItemSeed {
  name: string;
  count: number;
  lastAddedAt: string;
}
