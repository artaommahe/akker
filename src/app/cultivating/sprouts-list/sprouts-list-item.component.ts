import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Sprout } from '../../barn/barn.service';

@Component({
  selector: 'app-sprouts-list-item',
  template: `
    <button class="flex items-center gap-2 px-2 py-1 w-full text-left" (click)="onShowDetails.emit(sprout())">
      <span class="grow line-clamp-1">{{ sprout().name }}</span>
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
