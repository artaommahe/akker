import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CardRecallLevelComponent } from '../card-recall-level/card-recall-level.component';

@Component({
  selector: 'app-cards-list-item',
  template: `
    <button
      class="flex w-full cursor-pointer items-center gap-2 px-2 py-1 text-left"
      (click)="showDetails.emit(card())"
    >
      <span class="grow truncate">{{ card().term }}</span>

      <app-card-recall-level [stability]="card().stability" />
    </button>
  `,
  imports: [CardRecallLevelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsListItemComponent {
  card = input.required<CardsListItemCard>();
  showDetails = output<CardsListItemCard>();
}

export interface CardsListItemCard {
  id: string;
  term: string;
  stability: number | undefined;
}
