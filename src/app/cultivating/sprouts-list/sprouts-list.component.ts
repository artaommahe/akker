import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Sprout } from '../../barn/barn.service';

@Component({
  selector: 'app-sprouts-list',
  template: `
    <div class="flex flex-col gap-4">
      <section class="flex flex-col gap-2">
        <h2 class="text-lg">New sprouts</h2>

        <ul class="flex flex-col gap-2">
          @for (sprout of newSprouts(); track sprout.name) {
            <li class="flex items-center gap-2">
              <span class="grow line-clamp-1">{{ sprout.name }}</span>
              <button class="shrink-0" aria-label="remove" (click)="remove(sprout.name)">⌫</button>
            </li>
          }
        </ul>
      </section>

      @if (restSprouts().length) {
        <details>
          <summary class="text-lg">Rest</summary>

          <ul class="flex flex-col gap-2">
            @for (sprout of restSprouts(); track sprout.name) {
              <li class="flex items-center gap-2">
                <span class="grow line-clamp-1">{{ sprout.name }}</span>
                <button class="shrink-0" aria-label="remove" (click)="remove(sprout.name)">⌫</button>
              </li>
            }
          </ul>
        </details>
      }
    </div>
  `,
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SproutsListComponent {
  sprouts = input.required<Sprout[]>();
  onRemoveSprout = output<string>();

  sortedSprouts = computed(() => this.sprouts().toSorted((a, b) => b.addedAt - a.addedAt));
  newSprouts = computed(() => this.sortedSprouts().slice(0, newSproutsAmount));
  restSprouts = computed(() => this.sortedSprouts().slice(newSproutsAmount));

  remove(name: string) {
    this.onRemoveSprout.emit(name);
  }
}

const newSproutsAmount = 10;
