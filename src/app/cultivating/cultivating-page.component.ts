import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SproutsListComponent } from './sprouts-list/sprouts-list.component';
import { SproutDetailsComponent, type SproutDetailsSprout } from './sprout-details/sprout-details.component';
import { BarnService } from '../barn/barn.service';
import { DialogComponent } from '../ui/dialog/dialog.component';

@Component({
  selector: 'app-cultivating-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-sprouts-list [sprouts]="sprouts() ?? []" (showDetails)="sproutDetails.set($event)" />

      @let sprout = sproutDetails();

      @if (sproutDetails(); as sprout) {
        <app-dialog (close)="sproutDetails.set(null)">
          <app-sprout-details
            [sprout]="sprout"
            (cancel)="sproutDetails.set(null)"
            (remove)="onRemoveSprout(sprout.name)"
            (update)="onUpdateSprout(sprout.name, $event)"
          />
        </app-dialog>
      }
    </div>
  `,
  imports: [SproutsListComponent, SproutDetailsComponent, DialogComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CultivatingPageComponent {
  private barnService = inject(BarnService);

  sprouts = this.barnService.sprouts;
  sproutDetails = signal<SproutDetailsSprout | null>(null);

  onRemoveSprout(name: string) {
    this.barnService.removeSprout(name);
    this.sproutDetails.set(null);
  }

  onUpdateSprout(name: string, value: Partial<SproutDetailsSprout>) {
    this.barnService.updateSprout(name, value);
    this.sproutDetails.set(null);
  }
}
