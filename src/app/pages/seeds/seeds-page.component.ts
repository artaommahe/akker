import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SeedsListComponent } from 'src/app/seeds/seeds-list/seeds-list.component';
import { SeedsService } from 'src/app/seeds/seeds.service';
import { ExpansionPanelComponent } from 'src/app/ui/expansion-panel/expansion-panel.component';

import { AddSeedsButtonComponent } from '../../seeds/add-seeds-button/add-seeds-button.component';

@Component({
  selector: 'app-seeds-page',
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex gap-4">
        <section class="min-w-0 flex-1">
          <h2 class="text-secondary text-lg" id="top-seeds-heading">Top seeds</h2>

          <app-seeds-list
            [seeds]="topSeeds()"
            [isLoading]="seeds.isLoading()"
            [loadingError]="seeds.error()"
            [listAriaLabelledBy]="'top-seeds-heading'"
          />
        </section>

        <div class="border-l-primary/10 w-px self-stretch border-l"></div>

        <section class="min-w-0 flex-1">
          <h2 class="text-secondary text-lg" id="last-seeds-heading">Last seeds</h2>

          <app-seeds-list
            [seeds]="lastAddedSeeds()"
            [isLoading]="seeds.isLoading()"
            [loadingError]="seeds.error()"
            [listAriaLabelledBy]="'last-seeds-heading'"
          />
        </section>
      </div>

      <app-expansion-panel>
        <ng-container>All seeds ({{ sortedSeeds().length }})</ng-container>

        <ng-template>
          <app-seeds-list
            [seeds]="sortedSeeds()"
            [isLoading]="seeds.isLoading()"
            [loadingError]="seeds.error()"
            [listAriaLabel]="'All seeds'"
          />
        </ng-template>
      </app-expansion-panel>

      <app-add-seeds-button />
    </div>
  `,
  imports: [SeedsListComponent, AddSeedsButtonComponent, ExpansionPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedsPageComponent {
  private seedsService = inject(SeedsService);

  seeds = this.seedsService.getSeeds();

  sortedSeeds = computed(() => this.seeds.value()?.toSorted((a, b) => b.count - a.count) ?? []);
  topSeeds = computed(() => this.sortedSeeds()?.slice(0, topSeedsCount));
  lastAddedSeeds = computed(() => this.seeds.value()?.slice(0, topSeedsCount) ?? []);
}

const topSeedsCount = 10;
