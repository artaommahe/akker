import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { DialogComponent } from '../../ui/dialog/dialog.component';
import { type CardDetailsCard, CardDetailsComponent } from '../card-details/card-details.component';
import { CardsService } from '../cards.service';

@Component({
  selector: 'app-card-details-dialog',
  template: `
    <app-dialog [open]="open()" (dismiss)="dismiss.emit()">
      <ng-template>
        @if (card(); as card) {
          <app-card-details
            [card]="card"
            (dismiss)="dismiss.emit()"
            (remove)="onRemoveCard(card.id)"
            (update)="onUpdateCard(card.id, $event)"
          />
        }
      </ng-template>
    </app-dialog>
  `,
  imports: [DialogComponent, CardDetailsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDetailsDialogComponent {
  private cardsService = inject(CardsService);

  open = input.required<boolean>();
  card = input.required<CardDetailsCard | null>();
  dismiss = output();

  onRemoveCard(id: string) {
    this.cardsService.removeCard(id);
    this.dismiss.emit();
  }

  onUpdateCard(id: string, value: Partial<CardDetailsCard>) {
    this.cardsService.updateCard(id, value);
    this.dismiss.emit();
  }
}
