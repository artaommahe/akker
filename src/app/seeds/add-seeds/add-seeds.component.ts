import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';

import { ButtonDirective } from '../../ui/button/button';
import { InputDirective } from '../../ui/input/input';
import { SeedsService } from '../seeds.service';

@Component({
  selector: 'app-add-seeds',
  template: `
    <div class="flex h-full flex-col gap-4">
      <h2 class="text-xl">Add seeds</h2>

      <div class="flex grow flex-col gap-2">
        <p class="text-secondary" id="new-seeds-hint">One seed per line</p>
        <textarea
          class="grow"
          appInput
          aria-label="New seeds"
          aria-describedby="new-seeds-hint"
          [value]="newSeed()"
          (input)="updateSeed($event)"
        ></textarea>
      </div>

      <div class="mt-auto flex shrink-0 justify-end gap-4">
        <button appButton (click)="dismiss.emit()">Cancel</button>
        <button appButton appButtonType="primary" (click)="add()">Add</button>
      </div>
    </div>
  `,
  imports: [ButtonDirective, InputDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSeedsComponent {
  private seedsService = inject(SeedsService);

  dismiss = output();

  newSeed = signal('');

  updateSeed(event: Event) {
    this.newSeed.set((event.target as HTMLTextAreaElement).value);
  }

  add() {
    const newSeeds = this.newSeed()
      .split('\n')
      .map(seed => seed.trim())
      .filter(seed => !!seed);

    if (newSeeds.length !== 0) {
      this.seedsService.addSeeds(newSeeds);
    }

    this.dismiss.emit();
  }
}
