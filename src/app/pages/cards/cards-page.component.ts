import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CardsListComponent } from 'src/app/cards/cards-list/cards-list.component';
import { CardsService } from 'src/app/cards/cards.service';
import { ExpansionPanelComponent } from 'src/app/ui/expansion-panel/expansion-panel.component';

import { AddCardsButtonComponent } from '../../cards/add-cards-button/add-cards-button.component';
import { LearnCardsButtonComponent } from '../../learning/learn-cards-button/learn-cards-button.component';

@Component({
  selector: 'app-cards-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-learn-cards-button />

      <section class="flex flex-col gap-2">
        <h2 class="text-secondary text-lg" id="new-cards-heading">New cards</h2>

        <app-cards-list
          [cards]="newCards()"
          [isLoading]="cards.isLoading()"
          [loadingError]="cards.error()"
          [listAriaLabelledBy]="'new-cards-heading'"
        />
      </section>

      <app-expansion-panel>
        <ng-container>Rest ({{ restCards().length }})</ng-container>

        <ng-template>
          <app-cards-list [cards]="restCards()" [listAriaLabel]="'Rest cards'" />
        </ng-template>
      </app-expansion-panel>

      <app-add-cards-button />
    </div>
  `,
  imports: [CardsListComponent, LearnCardsButtonComponent, AddCardsButtonComponent, ExpansionPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsPageComponent {
  private cardsService = inject(CardsService);

  cards = this.cardsService.getCards();
  formattedCards = computed(
    () => this.cards.value()?.map(card => ({ ...card, stability: card.fsrs?.card.stability })) ?? [],
  );
  newCards = computed(() => this.formattedCards().slice(0, newCardsCount));
  restCards = computed(() => this.formattedCards().slice(newCardsCount));
}

const newCardsCount = 10;
