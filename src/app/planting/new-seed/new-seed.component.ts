import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { InputDirective } from '../../ui/input/input';
import multilineInput from './assets/multiline-input.svg';
import input from './assets/input.svg';
import { IconComponent } from '../../ui/icon/icon';
import { provideIcons } from '../../ui/icon/provide-icons';

@Component({
  selector: 'app-new-seed',
  template: `
    <div class="flex items-start gap-2">
      <!-- TODO: ui/button -->
      <button
        class="mt-2"
        [title]="mode() === 'single' ? 'Toggle multiline mode' : 'Toggle single mode'"
        (click)="toggleMode()"
      >
        <app-icon class="size-6 text-action-secondary" [name]="mode() === 'single' ? 'multilineInput' : 'input'" />
      </button>

      @if (mode() === 'single') {
        <input
          class="grow text-center"
          appInput
          type="text"
          placeholder="New seed"
          autocapitalize="off"
          [value]="newSeed()"
          (input)="updateSeed($event)"
          (keydown.enter)="onAdd()"
        />
      } @else {
        <textarea
          class="grow"
          appInput
          placeholder="One seed a line"
          rows="10"
          autocapitalize="off"
          [value]="newSeed()"
          (input)="updateSeed($event)"
        ></textarea>
      }

      <button class="mt-2" [title]="mode() === 'single' ? 'Add seed' : 'Add seeds'" (click)="onAdd()">
        <app-icon class="size-6 text-action-primary" name="plusInCircle" />
      </button>
    </div>
  `,
  imports: [InputDirective, IconComponent],
  providers: [provideIcons({ multilineInput, input })],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewSeedComponent {
  addSeeds = output<string[]>();

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

    this.addSeeds.emit([seed]);
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

    this.addSeeds.emit(newSeeds);
    this.newSeed.set('');
  }
}
