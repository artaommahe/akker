import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-cards-list-item',
  template: `
    <button class="flex w-full items-center gap-2 px-2 py-1 text-left" (click)="showDetails.emit(card())">
      <span class="line-clamp-1 grow">{{ card().term }}</span>
    </button>
  `,
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsListItemComponent {
  card = input.required<CardsListItemCard>();
  showDetails = output<CardsListItemCard>();
}

export interface CardsListItemCard {
  id: string;
  term: string;
}
