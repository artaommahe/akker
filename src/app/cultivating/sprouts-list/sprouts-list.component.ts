import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Sprout } from '../../barn/barn.service';

@Component({
  selector: 'app-sprouts-list',
  template: `
    <ul class="flex flex-col gap-2">
      @for (sprout of sprouts(); track sprout.name) {
        <li class="flex items-center gap-2">
          <span class="grow line-clamp-1">{{ sprout.name }}</span>
          <button class="shrink-0" aria-label="remove" (click)="remove(sprout.name)">⌫</button>
        </li>
      }
    </ul>
  `,
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SproutsListComponent {
  sprouts = input.required<Sprout[]>();
  onRemoveSprout = output<string>();

  remove(name: string) {
    this.onRemoveSprout.emit(name);
  }
}
