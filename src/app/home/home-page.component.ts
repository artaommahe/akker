import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LearnCardsComponent } from '../learning/learn-cards.component';
import { AddTermsButtonComponent } from './add-terms-button/add-terms-button.component';
import { LastSeedsListComponent } from './last-seeds-list/last-seeds-list.component';
import { LastSproutsListComponent } from './last-sprouts-list/last-sprouts-list.component';
import { UnsortedSproutsComponent } from './unsorted-sprouts/unsorted-sprouts.component';

@Component({
  selector: 'app-home-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-unsorted-sprouts />

      <app-learn-cards />

      <div class="div flex gap-4">
        <div class="flex-1">
          <app-last-sprouts-list />
        </div>

        <div class="w-px self-stretch border-l border-l-primary/10"></div>

        <div class="flex-1">
          <app-last-seeds-list />
        </div>
      </div>

      <app-add-terms-button />
    </div>
  `,
  imports: [
    UnsortedSproutsComponent,
    LearnCardsComponent,
    AddTermsButtonComponent,
    LastSeedsListComponent,
    LastSproutsListComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
