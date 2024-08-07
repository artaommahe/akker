import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { SproutsListItemComponent, type SproutsListItemSprout } from './sprouts-list-item.component';
import { ExpansionPanelComponent } from '../../ui/expansion-panel/expansion-panel.component';

@Component({
  selector: 'app-sprouts-list',
  template: `
    <div class="flex flex-col gap-4">
      <section class="flex flex-col gap-2">
        <h2 class="text-lg">New sprouts</h2>

        <ul class="flex flex-col gap-2">
          @for (sprout of newSprouts(); track sprout.name) {
            <li>
              <app-sprouts-list-item [sprout]="sprout" (showDetails)="showDetails.emit($event)" />
            </li>
          }
        </ul>
      </section>

      @if (restSprouts().length) {
        <app-expansion-panel>
          <ng-container>Rest ({{ restSprouts().length }})</ng-container>

          <ng-template #content>
            @for (sprout of restSprouts(); track sprout.name) {
              <li>
                <app-sprouts-list-item [sprout]="sprout" (showDetails)="showDetails.emit($event)" />
              </li>
            }
          </ng-template>
        </app-expansion-panel>
      }
    </div>
  `,
  imports: [SproutsListItemComponent, ExpansionPanelComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SproutsListComponent {
  sprouts = input.required<SproutsListSprout[]>();
  showDetails = output<SproutsListItemSprout>();

  sortedSprouts = computed(() => this.sprouts().toSorted((a, b) => b.addedAt.localeCompare(a.addedAt)));
  newSprouts = computed(() => this.sortedSprouts().slice(0, newSproutsAmount));
  restSprouts = computed(() => this.sortedSprouts().slice(newSproutsAmount));
}

const newSproutsAmount = 10;

export interface SproutsListSprout extends SproutsListItemSprout {
  addedAt: string;
}
