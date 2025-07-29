import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CardsListComponent } from 'src/app/cards/cards-list/cards-list.component';
import { CardsService } from 'src/app/cards/cards.service';

@Component({
  selector: 'app-last-cards-list',
  template: `
    <section class="flex flex-col gap-2">
      <h2 class="text-secondary text-lg" id="last-cards-heading">Last cards</h2>

      <app-cards-list
        [cards]="formattedLastCards()"
        [isLoading]="lastCards.isLoading()"
        [loadingError]="lastCards.error()"
        [listAriaLabelledBy]="'last-cards-heading'"
      />
    </section>
  `,
  imports: [CardsListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastCardsListComponent {
  private cardsService = inject(CardsService);

  lastCards = this.cardsService.getCards(() => ({ limit: lastCardsCount }));
  formattedLastCards = computed(
    () => this.lastCards.value()?.map(card => ({ ...card, stability: card.fsrs?.card.stability })) ?? [],
  );
}

const lastCardsCount = 10;
