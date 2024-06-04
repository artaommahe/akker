import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NewSeedComponent } from './new-seed/new-seed.component';

@Component({
  selector: 'app-seeding-page',
  template: `
    <div class="flex flex-col gap-2">
      <app-new-seed></app-new-seed>
      <!-- <app-seed-list></app-seed-list> -->
    </div>
  `,
  imports: [NewSeedComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedingPageComponent {}
