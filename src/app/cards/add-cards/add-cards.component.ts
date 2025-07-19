import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { parse } from 'csv-parse/browser/esm/sync';

import { ButtonDirective } from '../../ui/button/button';
import { InputDirective } from '../../ui/input/input';
import { CardsService, type NewCard } from '../cards.service';

@Component({
  selector: 'app-add-cards',
  template: `
    <form class="flex h-full flex-col gap-3" [formGroup]="form" (ngSubmit)="onSubmit()">
      <h2 class="text-xl">Add cards</h2>

      <ul id="new-cards-hint">
        <li>- one card per line</li>
        <li>- format: term;fullTerm;definition;comma-separated-tags</li>
        <li>- only letters and numbers are allowed in tags</li>
      </ul>

      <textarea
        class="grow"
        appInput
        formControlName="newCards"
        aria-label="New cards list"
        aria-describedby="new-cards-hint"
      ></textarea>

      @if (parseError()) {
        <p class="text-semantic-danger shrink-0">{{ parseError() }}</p>
      }

      <div class="mt-auto flex shrink-0 justify-end gap-4">
        <button type="button" appButton (click)="dismiss.emit()">Close</button>
        <button type="submit" appButton appButtonType="primary">Add</button>
      </div>
    </form>
  `,
  imports: [ButtonDirective, InputDirective, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCardsComponent {
  private cardsService = inject(CardsService);

  dismiss = output();

  form = inject(NonNullableFormBuilder).group({
    newCards: [''],
  });

  parseError = signal<string | null>(null);

  onSubmit() {
    this.parseError.set(null);

    try {
      const newCards = (
        parse(this.form.getRawValue().newCards, {
          delimiter: ';',
          columns: ['term', 'fullTerm', 'definition', 'tags'],
          relaxColumnCountLess: true,
        }) as ParsedCard[]
      )
        .filter((card): card is ParsedCard & Required<Pick<ParsedCard, 'term'>> => !!card.term)
        .map(
          card =>
            ({
              term: card.term.trim(),
              fullTerm: card.fullTerm?.trim(),
              definition: card.definition?.trim(),
              tags: card.tags
                ?.split(',')
                .map(tag => tag.trim())
                .filter(tag => !!tag && /^[a-zA-Z0-9]+$/.test(tag)),
            }) satisfies NewCard,
        );

      this.cardsService.addCards(newCards);
    } catch (error) {
      this.parseError.set(String(error));
      return;
    }

    this.dismiss.emit();
  }
}

interface ParsedCard {
  term?: string;
  fullTerm?: string;
  definition?: string;
  tags?: string;
}
