import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-new-seed',
  template: `
    <div class="flex flex-col gap-2">
      <!-- TODO: ui/input -->
      <input
        type="text"
        class="p-2 border border-primary/50 text-center"
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
  onNewSeed = output<string>();

  newSeed = signal('');

  updateSeed(event: Event) {
    this.newSeed.set((event.target as HTMLInputElement).value);
  }

  saveSeed() {
    const seed = this.newSeed();

    if (!seed) {
      return;
    }

    this.onNewSeed.emit(seed);
    this.newSeed.set('');
  }
}
