import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-new-seed',
  template: `
    <div class="flex gap-2 items-start">
      <!-- TODO: ui/button -->
      <button [title]="mode() === 'single' ? 'Toggle multiline mode' : 'Toggle single mode'" (click)="toggleMode()">
        @if (mode() === 'single') {
          𝍌
        } @else {
          ~
        }
      </button>

      <!-- TODO: ui/input -->
      @if (mode() === 'single') {
        <input
          type="text"
          class="p-2 border border-primary/50 text-center grow"
          placeholder="New seed"
          [value]="newSeed()"
          (input)="updateSeed($event)"
          (keydown.enter)="saveSeed()"
        />
      } @else {
        <textarea
          class="grow p-2 border border-primary/50"
          placeholder="One seed a line"
          rows="10"
          #seedsList
        ></textarea>

        <button title="Add seeds" (click)="saveSeedsList(seedsList)">➕</button>
      }
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewSeedComponent {
  onNewSeed = output<string>();
  onNewSeedsList = output<string[]>();

  mode = signal<'single' | 'multiple'>('single');
  newSeed = signal('');

  toggleMode() {
    this.mode.set(this.mode() === 'single' ? 'multiple' : 'single');
  }

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

  saveSeedsList(seedsList: HTMLTextAreaElement) {
    const newSeeds = seedsList.value
      .split('\n')
      .map(seed => seed.trim())
      .filter(seed => !!seed);

    if (newSeeds.length === 0) {
      return;
    }

    this.onNewSeedsList.emit(newSeeds);
    seedsList.value = '';
  }
}
