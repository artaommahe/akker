import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { parse } from 'csv-parse/browser/esm/sync';

import { BarnService } from '../../barn/barn.service';
import { ButtonDirective } from '../../ui/button/button';
import { InputDirective } from '../../ui/input/input';

@Component({
  selector: 'app-add-cards',
  template: `
    <div class="flex h-full flex-col gap-8">
      <textarea
        class="grow"
        appInput
        placeholder="term;fullTerm;definition (one per line)"
        [value]="newCards()"
        (input)="updateNewCards($event)"
      ></textarea>

      @if (parseError()) {
        <div class="text-semantic-danger shrink-0">{{ parseError() }}</div>
      }

      <div class="mt-auto flex shrink-0 justify-end gap-4">
        <button appButton (click)="dismiss.emit()">Cancel</button>
        <button appButton appButtonType="primary" (click)="add()">Add</button>
      </div>
    </div>
  `,
  imports: [ButtonDirective, InputDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCardsComponent {
  private barnService = inject(BarnService);

  dismiss = output();

  newCards = signal('');
  parseError = signal<string | null>(null);

  updateNewCards(event: Event) {
    this.newCards.set((event.target as HTMLTextAreaElement).value);
  }

  add() {
    this.parseError.set(null);

    try {
      const newCards = (
        parse(this.newCards(), { delimiter: ';', columns: ['term', 'fullTerm', 'definition'] }) as ParsedCard[]
      ).filter(card => !!card.term);

      this.barnService.addCards(newCards);
    } catch (error) {
      this.parseError.set(String(error));
      return;
    }

    this.dismiss.emit();
  }
}

interface ParsedCard {
  term: string;
  fullTerm: string;
  definition: string;
}
