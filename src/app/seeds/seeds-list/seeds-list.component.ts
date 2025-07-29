import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';

import { SeedDetailsDialogComponent } from '../seed-details-dialog/seed-details-dialog.component';
import type { SeedDetailsSeed } from '../seed-details/seed-details.component';
import { SeedsListItemComponent, type SeedsListItemSeed } from '../seeds-list-item/seeds-list-item.component';

@Component({
  selector: 'app-seeds-list',
  template: `
    @if (isLoading()) {
      <p>Loading...</p>
    } @else if (loadingError()) {
      <p class="text-semantic-danger">Error loading seeds list:</p>
      <p>{{ loadingError() }}</p>
    } @else {
      <ul class="flex flex-col gap-2" [attr.aria-label]="listAriaLabel()" [attr.aria-labelledby]="listAriaLabelledBy()">
        @for (seed of seeds(); track seed.name) {
          <li>
            <app-seeds-list-item [seed]="seed" (showDetails)="seedDetailsDialog.set({ open: true, seed })" />
          </li>
        }
      </ul>
    }

    <app-seed-details-dialog
      [open]="seedDetailsDialog().open"
      [seed]="seedDetailsDialog().seed"
      (dismiss)="closeSeedDetailsDialog()"
    />
  `,
  imports: [SeedDetailsDialogComponent, SeedsListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedsListComponent {
  seeds = input.required<SeedsListSeed[] | undefined>();
  isLoading = input<boolean>();
  loadingError = input<Error>();
  listAriaLabel = input<string>();
  listAriaLabelledBy = input<string>();

  seedDetailsDialog = signal<{ open: boolean; seed: SeedDetailsSeed | null }>({ open: false, seed: null });

  constructor() {
    effect(() => {
      if (!this.listAriaLabel() && !this.listAriaLabelledBy()) {
        throw new Error('SeedsListComponent: Either listAriaLabel or listAriaLabelledBy input must be provided');
      }
    });
  }

  closeSeedDetailsDialog() {
    this.seedDetailsDialog.update(value => ({ ...value, open: false }));
  }
}

export interface SeedsListSeed extends SeedsListItemSeed, SeedDetailsSeed {}
