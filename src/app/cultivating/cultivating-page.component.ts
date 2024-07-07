import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SproutsListComponent } from './sprouts-list/sprouts-list.component';
import { SproutDetailsComponent, type SproutDetailsSprout } from './sprout-details/sprout-details.component';
import { provideIcons } from '../ui/icon/provide-icons';
import cross from '../ui/modal/assets/cross.svg';
import { IconComponent } from '../ui/icon/icon';
import { BarnV2Service } from '../barn/barnV2.service';

@Component({
  selector: 'app-cultivating-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-sprouts-list [sprouts]="sprouts() ?? []" (onShowDetails)="sproutDetails.set($event)" />

      <!-- TODO: ui/dialog -->
      @if (sproutDetails(); as sprout) {
        <div class="fixed inset-0 bg-primary p-5">
          <!-- TODO: ui/button -->
          <button class="absolute right-2 top-2 p-2" (click)="sproutDetails.set(null)">
            <app-icon class="size-6 text-secondary" name="cross" />
          </button>
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
  imports: [SproutsListComponent, SproutDetailsComponent, IconComponent],
  providers: [provideIcons({ cross })],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CultivatingPageComponent {
  private barnService = inject(BarnV2Service);

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
