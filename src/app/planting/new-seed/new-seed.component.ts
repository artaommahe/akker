import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BarnService } from '../../barn/barn.service';

@Component({
  selector: 'app-new-seed',
  template: `
    <div class="flex flex-col gap-2">
      <input
        type="text"
        class="p-2 border border-support/50 text-center"
        placeholder="New seed"
        [value]="newSeed()"
        (input)="updateSeed($event)"
        (keydown.enter)="saveSeed()"
      />
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewSeedComponent {
  newSeed = signal('');

  private barn = inject(BarnService);

  updateSeed(event: Event) {
    this.newSeed.set((event.target as HTMLInputElement).value);
  }

  saveSeed() {
    const seed = this.newSeed();

    if (!seed) {
      return;
    }

    this.barn.addSeed(seed);
    this.newSeed.set('');
  }
}
