import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LearnCardsComponent } from '../learning/learn-cards.component';
import { AddTermsButtonComponent } from './add-terms-button/add-terms-button.component';
import { LastSeedsListComponent } from './last-seeds-list/last-seeds-list.component';
import { UnsortedSproutsComponent } from './unsorted-sprouts/unsorted-sprouts.component';

@Component({
  selector: 'app-home-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-unsorted-sprouts />

      <app-learn-cards />

      <app-last-seeds-list />

      <app-add-terms-button />
    </div>
  `,
  imports: [UnsortedSproutsComponent, LearnCardsComponent, AddTermsButtonComponent, LastSeedsListComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
