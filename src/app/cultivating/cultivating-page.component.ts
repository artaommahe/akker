import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SproutsListComponent } from './sprouts-list/sprouts-list.component';
import { SproutDetailsComponent, type SproutDetailsSprout } from './sprout-details/sprout-details.component';
import { BarnService } from '../barn/barn.service';
import { DialogComponent } from '../ui/dialog/dialog.component';
import { LearnCardsComponent } from '../learning/learn-cards.component';

@Component({
  selector: 'app-cultivating-page',
  template: `
    <div class="flex flex-col items-start gap-4">
      <app-learn-cards />

      <app-sprouts-list [sprouts]="sprouts() ?? []" (showDetails)="onShowDetails($event)" />

      @if (sproutDetails(); as sprout) {
        <app-dialog (close)="sproutDetails.set(null)">
          <app-sprout-details
            [sprout]="sprout"
            (cancel)="sproutDetails.set(null)"
            (remove)="onRemoveSprout(sprout.id)"
            (update)="onUpdateSprout(sprout.id, $event)"
          />
        </app-dialog>
      }
    </div>
  `,
  imports: [SproutsListComponent, SproutDetailsComponent, DialogComponent, LearnCardsComponent],
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

  onRemoveSprout(id: string) {
    this.barnService.removeSprout(id);
    this.sproutDetails.set(null);
  }

  onUpdateSprout(id: string, value: Partial<SproutDetailsSprout>) {
    this.barnService.updateSprout(id, value);
    this.sproutDetails.set(null);
  }
}
