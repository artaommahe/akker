import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Sprout } from '../../barn/barn.service';
import { SproutDetailsComponent, SproutFormValue } from '../sprout-details/sprout-details.component';

@Component({
  selector: 'app-sprouts-list-item',
  template: `
    <button class="flex items-center gap-2 px-2 py-1 w-full text-left" (click)="detailsAreOpen.set(true)">
      <span class="grow line-clamp-1">{{ sprout().name }}</span>
    </button>

    <!-- TODO: use a proper dialog -->
    @if (detailsAreOpen()) {
      <div class="fixed inset-0 p-5 bg-background-primary">
        <button class="absolute top-2 right-2 p-2" (click)="detailsAreOpen.set(false)">⛌</button>
        <app-sprout-details
          [sprout]="sprout()"
          (onCancel)="detailsAreOpen.set(false)"
          (onRemove)="onRemove.emit(sprout().name)"
          (onUpdate)="onUpdate.emit({ name: sprout().name, value: $event })"
        />
      </div>
    }
  `,
  imports: [SproutDetailsComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SproutsListItemComponent {
  sprout = input.required<Sprout>();
  onRemove = output<string>();
  onUpdate = output<UpdateSproutData>();

  detailsAreOpen = signal(false);
}

export interface UpdateSproutData {
  name: string;
  value: SproutFormValue;
}
