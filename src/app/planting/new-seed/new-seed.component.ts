import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-new-seed',
  template: `
    <div class="flex gap-2 items-start">
      <!-- TODO: ui/button -->
      <button
        class="text-action-secondary"
        [title]="mode() === 'single' ? 'Toggle multiline mode' : 'Toggle single mode'"
        (click)="toggleMode()"
      >
        @if (mode() === 'single') {
          𝍌
        } @else {
          ~
        }
      </button>

      <!-- TODO: ui/input -->
      @if (mode() === 'single') {
        <input
          class="p-2 border border-transparent bg-secondary rounded-lg placeholder:text-secondary text-center grow focus-visible:border-primary outline-none"
          type="text"
          placeholder="New seed"
          autocapitalize="off"
          [value]="newSeed()"
          (input)="updateSeed($event)"
          (keydown.enter)="onAdd()"
        />
      } @else {
        <!-- TODO: ui/textarea -->
        <textarea
          class="grow p-2 border border-transparent bg-secondary rounded-lg placeholder:text-secondary focus-visible:border-primary outline-none"
          placeholder="One seed a line"
          rows="10"
          autocapitalize="off"
          [value]="newSeed()"
          (input)="updateSeed($event)"
        ></textarea>
      }

      <button class="text-action-primary" [title]="mode() === 'single' ? 'Add seed' : 'Add seeds'" (click)="onAdd()">
        +
      </button>
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
    this.newSeed.set((event.target as HTMLInputElement | HTMLTextAreaElement).value);
  }

  onAdd() {
    if (this.mode() === 'single') {
      this.saveSeed();
    } else {
      this.saveSeedsList();
    }
  }

  private saveSeed() {
    const seed = this.newSeed();

    if (!seed) {
      return;
    }

    this.onNewSeed.emit(seed);
    this.newSeed.set('');
  }

  private saveSeedsList() {
    const seedsList = this.newSeed();

    if (!seedsList) {
      return;
    }

    const newSeeds = seedsList
      .split('\n')
      .map(seed => seed.trim())
      .filter(seed => !!seed);

    if (newSeeds.length === 0) {
      return;
    }

    this.onNewSeedsList.emit(newSeeds);
    this.newSeed.set('');
  }
}
