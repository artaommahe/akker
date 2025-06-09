import { ChangeDetectionStrategy, Component, type OnInit, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonDirective } from '../../ui/button/button';
import { InputDirective } from '../../ui/input/input';

@Component({
  selector: 'app-seed-details',
  template: `
    <form class="flex h-full flex-col gap-4" [formGroup]="form" (ngSubmit)="onSubmit()">
      <h2 class="text-xl">Seed details</h2>

      <label>
        Name
        <input appInput type="text" formControlName="name" minlength="1" required />
      </label>

      <div class="mt-auto flex gap-4">
        <button
          class="text-secondary mr-auto"
          appButton
          appButtonSemantic="warning"
          type="button"
          (click)="remove.emit()"
        >
          Remove
        </button>
        <button type="button" appButton (click)="dismiss.emit()">Cancel</button>
        <button type="submit" appButton appButtonType="primary">Save</button>
      </div>
    </form>
  `,
  imports: [ReactiveFormsModule, InputDirective, ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedDetailsComponent implements OnInit {
  seed = input.required<SeedDetailsSeed>();
  remove = output<void>();
  dismiss = output<void>();
  update = output<SeedDetailsSeed>();

  form = inject(NonNullableFormBuilder).group({
    // TODO: ? check that name is not used by other seeds
    name: ['', [Validators.minLength(1), Validators.required]],
  });

  ngOnInit() {
    this.form.setValue({ name: this.seed().name });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.update.emit(this.form.getRawValue());
  }
}

export interface SeedDetailsSeed {
  name: string;
}
