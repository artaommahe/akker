import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { SproutsListItemComponent, type SproutsListItemSprout } from './sprouts-list-item.component';

@Component({
  selector: 'app-sprouts-list',
  template: `
    <div class="flex flex-col gap-4">
      <section class="flex flex-col gap-2">
        <h2 class="text-lg">New sprouts</h2>

        <ul class="flex flex-col gap-2">
          @for (sprout of newSprouts(); track sprout.name) {
            <li>
              <app-sprouts-list-item [sprout]="sprout" (onShowDetails)="onShowDetails.emit($event)" />
            </li>
          }
        </ul>
      </section>

      @if (restSprouts().length) {
        <!-- TODO: ui/expansion-panel -->
        <details>
          <summary class="text-lg">Rest</summary>

          <ul class="flex flex-col gap-2">
            @for (sprout of restSprouts(); track sprout.name) {
              <li>
                <app-sprouts-list-item [sprout]="sprout" (onShowDetails)="onShowDetails.emit($event)" />
              </li>
            }
          </ul>
        </details>
      }
    </div>
  `,
  imports: [SproutsListItemComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SproutsListComponent {
  sprouts = input.required<SproutsListSprout[]>();
  onShowDetails = output<SproutsListItemSprout>();

  sortedSprouts = computed(() => this.sprouts().toSorted((a, b) => b.addedAt.localeCompare(a.addedAt)));
  newSprouts = computed(() => this.sortedSprouts().slice(0, newSproutsAmount));
  restSprouts = computed(() => this.sortedSprouts().slice(newSproutsAmount));
}

const newSproutsAmount = 10;

export interface SproutsListSprout extends SproutsListItemSprout {
  addedAt: string;
}
