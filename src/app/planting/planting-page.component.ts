import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NewSeedComponent } from './new-seed/new-seed.component';
import { SeedsListComponent } from './seeds-list/seeds-list.component';
import { BarnService } from '../barn/barn.service';

@Component({
  selector: 'app-planting-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-new-seed (onNewSeed)="onNewSeed($event)"></app-new-seed>
      <app-seeds-list [seeds]="seeds()" (onRemoveSeed)="onRemoveSeed($event)"></app-seeds-list>
    </div>
  `,
  imports: [NewSeedComponent, SeedsListComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantingPageComponent {
  private barn = inject(BarnService);

  seeds = computed(() => Object.values(this.barn.seeds()));

  onNewSeed(name: string) {
    this.barn.addSeed(name);
  }

  onRemoveSeed(name: string) {
    this.barn.removeSeed(name);
  }
}
