import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Sprout } from '../../barn/barn.service';

@Component({
  selector: 'app-sprouts-list-item',
  template: `
    <button class="flex w-full items-center gap-2 px-2 py-1 text-left" (click)="onShowDetails.emit(sprout())">
      <span class="line-clamp-1 grow">{{ sprout().name }}</span>
    </button>
  `,
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SproutsListItemComponent {
  sprout = input.required<Sprout>();
  onShowDetails = output<Sprout>();
}
