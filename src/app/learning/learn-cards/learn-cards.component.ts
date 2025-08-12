import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown';

import { ButtonDirective } from '../../ui/button/button';
import { CardGrade } from '../learning.service';

// TODO: add tests
@Component({
  selector: 'app-learn-cards',
  template: `
    <div class="flex h-full flex-col gap-4 pb-16">
      <div class="text-secondary flex items-center justify-between">
        <div>
          to go
          <span class="text-action-primary">({{ learningCards().toGo.length }})</span>
        </div>
        <div>
          to repeat
          <span class="text-semantic-danger">({{ learningCards().repeat.length }})</span>
        </div>
        <div>
          learning
          <span class="text-semantic-success">({{ learningCards().learning.length }})</span>
        </div>
      </div>

      <button
        class="border-primary/10 flex grow flex-col items-center justify-center gap-2 rounded-sm border p-8"
        (click)="onCardClick()"
      >
        @if (currentCard(); as currentCard) {
          @if (showCardDefinition()) {
            <span class="text-primary text-2xl break-all">
              <markdown [data]="currentCard.fullTerm || currentCard.term" [inline]="true" />
            </span>
            @if (currentCard.definition) {
              <p class="text-secondary text-left">
                <markdown [data]="currentCard.definition" />
              </p>
            }
          } @else {
            <span class="text-primary text-2xl break-all">{{ currentCard.term }}</span>
          }
        } @else {
          <span class="text-secondary text-2xl">Done!</span>
        }
      </button>

      <div class="flex items-center justify-around" [class.invisible]="!currentCard()">
        <button appButton appButtonSemantic="danger" (click)="rate(CardGrade.Again)">Repeat</button>
        <button appButton appButtonSemantic="warning" (click)="rate(CardGrade.Hard)">Hard</button>
        <button appButton appButtonSemantic="success" (click)="rate(CardGrade.Good)">Good</button>
        <button appButton (click)="rate(CardGrade.Easy)">Easy</button>
      </div>
    </div>
  `,
  imports: [ButtonDirective, MarkdownComponent],
  providers: [provideMarkdown()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnCardsComponent<T extends LearnCardsCard> {
  cards = input.required<T[]>();
  rateCard = output<{ card: T; grade: CardGrade }>();

  learningCards = linkedSignal<{ toGo: T[]; repeat: T[]; learning: T[] }>(() => ({
    toGo: this.cards(),
    repeat: [],
    learning: [],
  }));
  currentCard = computed(() => this.learningCards().toGo.at(0) ?? this.learningCards().repeat.at(0) ?? null);
  CardGrade = CardGrade;
  showCardDefinition = signal(false);

  onCardClick() {
    const currentCard = this.currentCard();

    if (!currentCard?.definition && !currentCard?.fullTerm) {
      return;
    }

    this.showCardDefinition.update(showCardDefinition => !showCardDefinition);
  }

  rate(grade: CardGrade) {
    const currentCard = this.currentCard();

    if (!currentCard) {
      return;
    }

    this.learningCards.update(learningCards => {
      const toGo = learningCards.toGo.filter(card => card.id !== currentCard.id);
      // if card is repeated again it should be moved to the end of the list
      // otherwise just ensure that it is removed from the `repeat` list
      const otherCardsToRepeat = learningCards.repeat.filter(card => card.id !== currentCard.id);
      const repeat = grade === CardGrade.Again ? [...otherCardsToRepeat, currentCard] : otherCardsToRepeat;
      const learning = grade === CardGrade.Again ? learningCards.learning : [...learningCards.learning, currentCard];

      return { toGo, repeat, learning };
    });
    this.rateCard.emit({ card: currentCard, grade });
    this.showCardDefinition.set(false);
  }
}

export interface LearnCardsCard {
  id: string;
  term: string;
  fullTerm?: string;
  definition: string;
}
