import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CardsListComponent } from 'src/app/cards/cards-list/cards-list.component';

import { CardsService } from '../../../cards/cards.service';

@Component({
  selector: 'app-unsorted-cards',
  template: `
    <section>
      <h2 class="text-secondary text-lg" id="unsorted-cards-heading">
        Unsorted cards
        @if (unsortedCards.hasValue()) {
          ({{ unsortedCardsCount() }})
        }
      </h2>

      <app-cards-list
        [cards]="someUnsortedCards()"
        [isLoading]="unsortedCards.isLoading()"
        [loadingError]="unsortedCards.error()"
        listLabelledBy="unsorted-cards-heading"
        [isTwoColumnsLayout]="true"
      />
    </section>
  `,
  imports: [CardsListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsortedCardsComponent {
  private cardsService = inject(CardsService);

  unsortedCards = this.cardsService.getUnsortedCards();

  unsortedCardsCount = computed(() => this.unsortedCards.value()?.length ?? 0);
  someUnsortedCards = computed(
    () =>
      this.unsortedCards
        .value()
        ?.slice(0, someUnsortedCardsCount)
        .map(card => ({ ...card, stability: card.fsrs?.card.stability })) ?? [],
  );
}

const someUnsortedCardsCount = 10;
