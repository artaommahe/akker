import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';

import { BarnService } from '../../barn/barn.service';
import { ButtonDirective } from '../../ui/button/button';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { InputDirective } from '../../ui/input/input';

@Component({
  selector: 'app-add-terms-dialog',
  template: `
    <app-dialog (close)="close.emit()">
      <div class="flex h-full flex-col gap-8 pt-10">
        <textarea
          class="grow"
          appInput
          placeholder="One seed a line"
          autocapitalize="off"
          [value]="newSeed()"
          (input)="updateSeed($event)"
        ></textarea>

        <div class="mt-auto flex shrink-0 justify-end gap-4">
          <button appButton (click)="close.emit()">Cancel</button>
          <button appButton appButtonType="primary" (click)="add()">Add</button>
        </div>
      </div>
    </app-dialog>
  `,
  imports: [DialogComponent, ButtonDirective, InputDirective],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTermsDialogComponent {
  private barnService = inject(BarnService);

  close = output();

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
      this.barnService.addSeeds(newSeeds);
    }

    this.close.emit();
  }
}
