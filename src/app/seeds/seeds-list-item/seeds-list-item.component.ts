import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-seeds-list-item',
  template: `
    <button class="flex w-full items-center gap-2 px-2 py-1 text-left" (click)="showDetails.emit(seed())">
      <span class="grow truncate">{{ seed().name }}</span>
      <span class="shrink-0">{{ seed().count }}</span>
    </button>
  `,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedsListItemComponent {
  seed = input.required<SeedsListItemSeed>();
  showDetails = output<SeedsListItemSeed>();
}

export interface SeedsListItemSeed {
  name: string;
  count: number;
}
