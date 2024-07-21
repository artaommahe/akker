import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-sprouts-list-item',
  template: `
    <button class="flex w-full items-center gap-2 px-2 py-1 text-left" (click)="showDetails.emit(sprout())">
      <span class="line-clamp-1 grow">{{ sprout().name }}</span>
    </button>
  `,
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SproutsListItemComponent {
  sprout = input.required<SproutsListItemSprout>();
  showDetails = output<SproutsListItemSprout>();
}

export interface SproutsListItemSprout {
  name: string;
}
