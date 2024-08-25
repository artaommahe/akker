import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { BarnService } from '../barn/barn.service';
import { DialogComponent } from '../ui/dialog/dialog.component';
import { SeedDetailsComponent, type SeedDetailsSeed } from './seed-details/seed-details.component';
import { SeedsListComponent } from './seeds-list/seeds-list.component';

@Component({
  selector: 'app-planting-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-seeds-list [seeds]="seeds() ?? []" (showDetails)="seedDetails.set($event)" />

      @if (seedDetails(); as seed) {
        <app-dialog (close)="seedDetails.set(null)">
          <app-seed-details
            [seed]="seed"
            (cancel)="seedDetails.set(null)"
            (remove)="onRemoveSeed(seed.name)"
            (update)="onUpdateSeed(seed.name, $event)"
          />
        </app-dialog>
      }
    </div>
  `,
  imports: [SeedsListComponent, SeedDetailsComponent, DialogComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantingPageComponent {
  private barnService = inject(BarnService);

  seeds = this.barnService.seeds;
  seedDetails = signal<SeedDetailsSeed | null>(null);

  onRemoveSeed(name: string) {
    this.barnService.removeSeed(name);
    this.seedDetails.set(null);
  }

  onUpdateSeed(name: string, value: Partial<SeedDetailsSeed>) {
    this.barnService.updateSeed(name, value);
    this.seedDetails.set(null);
  }
}
