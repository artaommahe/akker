import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Seed } from '../../barn/barn.service';

@Component({
  selector: 'app-seeds-list-item',
  template: `
    <button class="flex w-full items-center gap-2 px-2 py-1 text-left" (click)="onShowDetails.emit(seed())">
      <span class="grow truncate">{{ seed().name }}</span>
      <span class="shrink-0">{{ seed().count }}</span>
    </button>
  `,
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedsListItemComponent {
  seed = input.required<Seed>();
  onShowDetails = output<Seed>();
}
