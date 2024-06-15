import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NewSeedComponent } from './new-seed/new-seed.component';
import { SeedsListComponent } from './seeds-list/seeds-list.component';
import { BarnService, Seed } from '../barn/barn.service';
import { SeedDetailsComponent } from './seed-details/seed-details.component';

@Component({
  selector: 'app-planting-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-new-seed (onNewSeed)="onNewSeed($event)" (onNewSeedsList)="onNewSeedsList($event)" />
      <app-seeds-list [seeds]="seeds()" (onShowDetails)="seedDetails.set($event)" />

      <!-- TODO: ui/dialog -->
      @if (seedDetails(); as seed) {
        <div class="fixed inset-0 p-5 bg-primary">
          <!-- TODO: ui/button -->
          <button class="absolute top-2 right-2 p-2" (click)="seedDetails.set(null)">⛌</button>
          <app-seed-details
            [seed]="seed"
            (onCancel)="seedDetails.set(null)"
            (onRemove)="onRemoveSeed(seed.name)"
            (onUpdate)="onUpdateSeed(seed.name, $event)"
          />
        </div>
      }
    </div>
  `,
  imports: [NewSeedComponent, SeedsListComponent, SeedDetailsComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantingPageComponent {
  private barnService = inject(BarnService);

  seeds = computed(() => Object.values(this.barnService.seeds()));
  seedDetails = signal<Seed | null>(null);

  onNewSeed(name: string) {
    this.barnService.addSeed(name);
  }

  onNewSeedsList(names: string[]) {
    this.barnService.addMultipleSeeds(names);
  }

  onRemoveSeed(name: string) {
    this.barnService.removeSeed(name);
    this.seedDetails.set(null);
  }

  onUpdateSeed(name: string, value: Partial<Seed>) {
    this.barnService.updateSeed(name, value);
    this.seedDetails.set(null);
  }
}
