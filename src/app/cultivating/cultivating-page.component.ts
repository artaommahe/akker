import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BarnService } from '../barn/barn.service';
import { SproutsListComponent } from './sprouts-list/sprouts-list.component';
import { UpdateSproutData } from './sprouts-list/sprouts-list-item.component';

@Component({
  selector: 'app-cultivating-page',
  template: `
    <div class="flex flex-col gap-4">
      <app-sprouts-list
        [sprouts]="sprouts()"
        (onRemoveSprout)="onRemoveSprout($event)"
        (onUpdateSprout)="onUpdateSprout($event)"
      />
    </div>
  `,
  imports: [SproutsListComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CultivatingPageComponent {
  private barnService = inject(BarnService);

  sprouts = this.barnService.sprouts;

  onRemoveSprout(name: string) {
    this.barnService.removeSprout(name);
  }

  onUpdateSprout({ name, value }: UpdateSproutData) {
    this.barnService.updateSprout(name, value);
  }
}
