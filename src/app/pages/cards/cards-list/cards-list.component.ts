import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import {
  type CardsListItemCard,
  CardsListItemComponent,
} from '../../../cards/cards-list-item/cards-list-item.component';
import { ExpansionPanelComponent } from '../../../ui/expansion-panel/expansion-panel.component';

@Component({
  selector: 'app-cards-list',
  template: `
    <div class="flex flex-col gap-4">
      <section class="flex flex-col gap-2">
        <h2 class="text-secondary text-lg">New cards</h2>

        <ul class="flex flex-col gap-2" aria-label="New cards list">
          @for (card of newCards(); track card.id) {
            <li>
              <app-cards-list-item [card]="card" (showDetails)="showDetails.emit($event.id)" />
            </li>
          }
        </ul>
      </section>

      @if (restCards().length) {
        <app-expansion-panel>
          <ng-container>Rest ({{ restCards().length }})</ng-container>

          <ng-template>
            @for (card of restCards(); track card.id) {
              <li>
                <app-cards-list-item [card]="card" (showDetails)="showDetails.emit($event.id)" />
              </li>
            }
          </ng-template>
        </app-expansion-panel>
      }
    </div>
  `,
  imports: [CardsListItemComponent, ExpansionPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsListComponent {
  cards = input.required<CardsListCard[]>();
  showDetails = output<string>();

  newCards = computed(() => this.cards().slice(0, newCardsCount));
  restCards = computed(() => this.cards().slice(newCardsCount));
}

const newCardsCount = 10;

export interface CardsListCard extends CardsListItemCard {}
