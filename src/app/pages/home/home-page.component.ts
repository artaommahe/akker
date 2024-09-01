import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LearnCardsComponent } from '../../learning/learn-cards.component';
import { AddTermsButtonComponent } from '../../planting/add-terms-button/add-terms-button.component';
import { LastCardsListComponent } from './last-cards-list/last-cards-list.component';
import { LastSeedsListComponent } from './last-seeds-list/last-seeds-list.component';
import { UnsortedCardsComponent } from './unsorted-cards/unsorted-cards.component';

@Component({
  selector: 'app-home-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-unsorted-cards />

      <app-learn-cards />

      <div class="div flex gap-4">
        <div class="flex-1">
          <app-last-cards-list />
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
    UnsortedCardsComponent,
    LearnCardsComponent,
    AddTermsButtonComponent,
    LastSeedsListComponent,
    LastCardsListComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
