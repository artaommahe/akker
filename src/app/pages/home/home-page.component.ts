import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LearnCardsComponent } from '../../learning/learn-cards.component';
import { AddSeedsButtonComponent } from '../../seeds/add-seeds-button/add-seeds-button.component';
import { LastCardsListComponent } from './last-cards-list/last-cards-list.component';
import { LastSeedsListComponent } from './last-seeds-list/last-seeds-list.component';
import { UnsortedCardsComponent } from './unsorted-cards/unsorted-cards.component';

@Component({
  selector: 'app-home-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-unsorted-cards />

      <app-learn-cards />

      <div class="flex gap-4">
        <div class="min-w-0 flex-1">
          <app-last-cards-list />
        </div>

        <div class="w-px self-stretch border-l border-l-primary/10"></div>

        <div class="min-w-0 flex-1">
          <app-last-seeds-list />
        </div>
      </div>

      <app-add-seeds-button />
    </div>
  `,
  imports: [
    UnsortedCardsComponent,
    LearnCardsComponent,
    AddSeedsButtonComponent,
    LastSeedsListComponent,
    LastCardsListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
