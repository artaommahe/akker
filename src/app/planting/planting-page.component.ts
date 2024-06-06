import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NewSeedComponent } from './new-seed/new-seed.component';
import { SeedsListComponent } from './seeds-list/seeds-list.component';
import { BarnService } from '../barn/barn.service';

@Component({
  selector: 'app-planting-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-new-seed (onNewSeed)="onNewSeed($event)" />
      <app-seeds-list [seeds]="seeds()" (onRemoveSeed)="onRemoveSeed($event)" />
    </div>
  `,
  imports: [NewSeedComponent, SeedsListComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantingPageComponent {
  private barnService = inject(BarnService);

  seeds = computed(() => Object.values(this.barnService.seeds()));

  onNewSeed(name: string) {
    this.barnService.addSeed(name);
  }

  onRemoveSeed(name: string) {
    this.barnService.removeSeed(name);
  }
}
