import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NewSeedComponent } from './new-seed/new-seed.component';
import { SeedsListComponent } from './seeds-list/seeds-list.component';
import { SeedDetailsComponent, type SeedDetailsSeed } from './seed-details/seed-details.component';
import { IconComponent } from '../ui/icon/icon';
import { provideIcons } from '../ui/icon/provide-icons';
import cross from '../ui/modal/assets/cross.svg';
import { BarnV2Service } from '../barn/barnV2.service';

@Component({
  selector: 'app-planting-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-new-seed (onNewSeed)="onNewSeed($event)" (onNewSeedsList)="onNewSeedsList($event)" />
      <app-seeds-list [seeds]="seeds() ?? []" (onShowDetails)="seedDetails.set($event)" />

      <!-- TODO: ui/dialog -->
      @if (seedDetails(); as seed) {
        <div class="fixed inset-0 bg-primary p-5">
          <!-- TODO: ui/button -->
          <button class="absolute right-2 top-2 p-2" (click)="seedDetails.set(null)">
            <app-icon class="size-6 text-secondary" name="cross" />
          </button>
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
  imports: [NewSeedComponent, SeedsListComponent, SeedDetailsComponent, IconComponent],
  providers: [provideIcons({ cross })],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantingPageComponent {
  private barnService = inject(BarnV2Service);

  seeds = this.barnService.seeds;
  seedDetails = signal<SeedDetailsSeed | null>(null);

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

  onUpdateSeed(name: string, value: Partial<SeedDetailsSeed>) {
    this.barnService.updateSeed(name, value);
    this.seedDetails.set(null);
  }
}
