import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LearnCardsComponent } from '../learning/learn-cards.component';
import { UnsortedSproutsComponent } from './unsorted-sprouts/unsorted-sprouts.component';

@Component({
  selector: 'app-home-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-unsorted-sprouts />

      <app-learn-cards />
    </div>
  `,
  imports: [UnsortedSproutsComponent, LearnCardsComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
