import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BarnService, Sprout } from '../barn/barn.service';
import { SproutsListComponent } from './sprouts-list/sprouts-list.component';
import { SproutDetailsComponent, SproutFormValue } from './sprout-details/sprout-details.component';

@Component({
  selector: 'app-cultivating-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-sprouts-list [sprouts]="sprouts()" (onShowDetails)="sproutDetails.set($event)" />

      <!-- TODO: ui/dialog -->
      @if (sproutDetails(); as sprout) {
        <div class="fixed inset-0 p-5 bg-primary">
          <!-- TODO: ui/button -->
          <button class="absolute top-2 right-2 p-2" (click)="sproutDetails.set(null)">⛌</button>
          <app-sprout-details
            [sprout]="sprout"
            (onCancel)="sproutDetails.set(null)"
            (onRemove)="onRemoveSprout(sprout.name)"
            (onUpdate)="onUpdateSprout(sprout.name, $event)"
          />
        </div>
      }
    </div>
  `,
  imports: [SproutsListComponent, SproutDetailsComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CultivatingPageComponent {
  private barnService = inject(BarnService);

  sprouts = this.barnService.sprouts;
  sproutDetails = signal<Sprout | null>(null);

  onRemoveSprout(name: string) {
    this.barnService.removeSprout(name);
    this.sproutDetails.set(null);
  }

  onUpdateSprout(name: string, value: SproutFormValue) {
    this.barnService.updateSprout(name, value);
    this.sproutDetails.set(null);
  }
}
