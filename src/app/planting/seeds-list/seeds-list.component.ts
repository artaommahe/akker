import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { SeedsListItemComponent, type SeedsListItemSeed } from './seeds-list-item.component';
import { ExpansionPanelComponent } from '../../ui/expansion-panel/expansion-panel.component';

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
                <app-seeds-list-item [seed]="seed" (showDetails)="showDetails.emit($event)" />
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
                <app-seeds-list-item [seed]="seed" (showDetails)="showDetails.emit($event)" />
              </li>
            }
          </ul>
        </section>
      </div>

      <app-expansion-panel>
        <ng-container>All seeds ({{ sortedSeeds().length }})</ng-container>

        <ng-template #content>
          @for (seed of sortedSeeds(); track seed.name) {
            <li>
              <app-seeds-list-item [seed]="seed" (showDetails)="showDetails.emit($event)" />
            </li>
          }
        </ng-template>
      </app-expansion-panel>
    </div>
  `,
  imports: [SeedsListItemComponent, ExpansionPanelComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedsListComponent {
  seeds = input.required<SeedsListSeed[]>();
  showDetails = output<SeedsListItemSeed>();

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
