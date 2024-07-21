import { ChangeDetectionStrategy, Component, computed, input, signal, type OnInit } from '@angular/core';
import { ButtonDirective } from '../ui/button/button';

@Component({
  selector: 'app-cards',
  template: `
    <div class="flex h-full flex-col gap-4 py-16">
      <div class="flex items-center justify-between text-secondary">
        <div>
          <span class="text-semantic-warning">({{ learningCards().length }})</span>
          learning
        </div>
        <div>
          know
          <span class="text-semantic-success">({{ knownCards().length }})</span>
        </div>
      </div>

      <div class="flex grow items-center justify-center rounded border border-primary/10">
        @if (currentCard(); as currentCard) {
          <span class="text-primary">{{ currentCard.name }}</span>
        } @else {
          <span class="text-secondary">Done!</span>
        }
      </div>

      <div class="flex items-center justify-around">
        <button appButton appButtonSemantic="warning" (click)="updateStatus('learning')">-</button>
        <button appButton appButtonSemantic="success" (click)="updateStatus('know')">+</button>
      </div>
    </div>
  `,
  imports: [ButtonDirective],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsComponent implements OnInit {
  cards = input.required<Card[]>();

  cardsWithData = signal<CardWithData[]>([]);
  currentCard = computed(
    () =>
      this.cardsWithData()
        .filter(card => card.status === null)
        .at(0) ?? null,
  );
  learningCards = computed(() => this.cardsWithData().filter(card => card.status === 'learning'));
  knownCards = computed(() => this.cardsWithData().filter(card => card.status === 'know'));

  ngOnInit() {
    this.cardsWithData.set(this.cards().map(card => ({ ...card, status: null })));
  }

  updateStatus(status: CardStatus) {
    const currentCard = this.currentCard();

    if (!currentCard) {
      return;
    }

    this.cardsWithData.update(cards => cards.map(card => (card.id === currentCard.id ? { ...card, status } : card)));
  }
}

export interface Card {
  id: string;
  name: string;
}

type CardStatus = 'learning' | 'know';

interface CardWithData extends Card {
  status: CardStatus | null;
}
