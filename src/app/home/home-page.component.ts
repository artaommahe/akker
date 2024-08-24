import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UnsortedSproutsComponent } from './unsorted-sprouts/unsorted-sprouts.component';

@Component({
  selector: 'app-home-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-unsorted-sprouts />
    </div>
  `,
  imports: [UnsortedSproutsComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
