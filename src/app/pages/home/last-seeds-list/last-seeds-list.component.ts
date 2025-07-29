import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeedsListComponent } from 'src/app/seeds/seeds-list/seeds-list.component';
import { SeedsService } from 'src/app/seeds/seeds.service';

@Component({
  selector: 'app-last-seeds-list',
  template: `
    <section class="flex flex-col gap-2">
      <h2 class="text-secondary text-lg" id="last-seeds-heading">Last seeds</h2>

      <app-seeds-list
        [seeds]="lastSeeds.value()"
        [isLoading]="lastSeeds.isLoading()"
        [loadingError]="lastSeeds.error()"
        [listAriaLabelledBy]="'last-seeds-heading'"
      />
    </section>
  `,
  imports: [SeedsListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastSeedsListComponent {
  private seedsService = inject(SeedsService);

  lastSeeds = this.seedsService.getSeeds({ limit: lastSeedsCount });
}

const lastSeedsCount = 10;
