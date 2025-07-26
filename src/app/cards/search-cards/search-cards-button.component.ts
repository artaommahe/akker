import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import clsx from 'clsx';
import { ModalComponent } from 'src/app/ui/modal/modal.component';

import { SearchCardsComponent } from './search-cards.component';

@Component({
  selector: 'app-search-cards-button',
  template: `
    <!-- NOTE: using button with explicit 'click' listener provides a better accessibility. Imitates input's styles-->
    <button
      class="bg-secondary focus-visible:border-primary text-secondary w-full rounded-lg border border-transparent p-2 text-left outline-hidden"
      (click)="searchModalIsVisible.set(true)"
    >
      Search cards...
    </button>

    <app-modal [open]="searchModalIsVisible()" [modalClass]="modalClass" (dismiss)="searchModalIsVisible.set(false)">
      <ng-template>
        <app-search-cards />
      </ng-template>
    </app-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalComponent, SearchCardsComponent],
})
export class SearchCardsButtonComponent {
  searchModalIsVisible = signal(false);

  modalClass = clsx(
    'border-secondary m-2 w-[calc(100vw-1rem)] rounded-xl border p-2',
    'backdrop:bg-primary/50 backdrop:backdrop-blur-xs',
    'transition-none',
  );
}
