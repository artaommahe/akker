import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NewSeedComponent } from './new-seed/new-seed.component';
import { SeedsListComponent } from './seeds-list/seeds-list.component';

@Component({
  selector: 'app-planting-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-new-seed></app-new-seed>
      <app-seeds-list></app-seeds-list>
    </div>
  `,
  imports: [NewSeedComponent, SeedsListComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantingPageComponent {}
