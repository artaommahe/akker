import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { BarnService } from '../barn/barn.service';
import { LearnCardsComponent } from '../learning/learn-cards.component';
import { SproutDetailsDialogComponent } from './sprout-details-dialog/sprout-details-dialog.component';
import { type SproutDetailsSprout } from './sprout-details/sprout-details.component';
import { SproutsListComponent } from './sprouts-list/sprouts-list.component';

@Component({
  selector: 'app-cultivating-page',
  template: `
    <div class="flex flex-col items-start gap-4">
      <app-learn-cards />

      <app-sprouts-list [sprouts]="sprouts() ?? []" (showDetails)="onShowDetails($event)" />

      @if (sproutDetails(); as sprout) {
        <app-sprout-details-dialog [sprout]="sprout" (close)="sproutDetails.set(null)" />
      }
    </div>
  `,
  imports: [SproutsListComponent, SproutDetailsDialogComponent, LearnCardsComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CultivatingPageComponent {
  private barnService = inject(BarnService);

  sprouts = this.barnService.sprouts;
  sproutDetails = signal<SproutDetailsSprout | null>(null);

  onShowDetails(sproutId: string) {
    const sprout = this.sprouts()?.find(sprout => sprout.id === sproutId);

    if (!sprout) {
      throw new Error(`Sprout with id ${sproutId} not found`);
    }

    this.sproutDetails.set(sprout);
  }
}
