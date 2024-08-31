import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { BarnService } from '../barn/barn.service';
import { AddTermsButtonComponent } from '../home/add-terms-button/add-terms-button.component';
import { SeedDetailsDialogComponent } from './seed-details-dialog/seed-details-dialog.component';
import type { SeedDetailsSeed } from './seed-details/seed-details.component';
import { SeedsListComponent } from './seeds-list/seeds-list.component';

@Component({
  selector: 'app-planting-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-seeds-list [seeds]="seeds() ?? []" (showDetails)="seedDetails.set($event)" />

      <app-add-terms-button />

      @if (seedDetails(); as seed) {
        <app-seed-details-dialog [seed]="seed" (close)="seedDetails.set(null)" />
      }
    </div>
  `,
  imports: [SeedsListComponent, SeedDetailsDialogComponent, AddTermsButtonComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantingPageComponent {
  private barnService = inject(BarnService);

  seeds = this.barnService.seeds;
  seedDetails = signal<SeedDetailsSeed | null>(null);
}
