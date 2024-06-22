import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Seed } from '../../barn/barn.service';
import { InputDirective } from '../../ui/input/input';

@Component({
  selector: 'app-seed-details',
  template: `
    <form class="flex h-full flex-col gap-2" [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>
        Name
        <input appInput type="text" formControlName="name" minlength="1" required />
      </label>

      <div class="mt-auto flex gap-4">
        <!-- TODO: ui/button -->
        <button class="mr-auto text-secondary" type="button" (click)="onRemove.emit()">Remove</button>
        <button type="button" (click)="onCancel.emit()">Cancel</button>
        <button type="submit">Save</button>
      </div>
    </form>
  `,
  imports: [ReactiveFormsModule, InputDirective],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedDetailsComponent implements OnInit {
  seed = input.required<Seed>();
  onRemove = output<void>();
  onCancel = output<void>();
  onUpdate = output<SeedFormValue>();

  form = inject(NonNullableFormBuilder).group({
    // TODO: ? check that name is not used by other seeds
    name: ['', [Validators.minLength(1), Validators.required]],
  });

  ngOnInit(): void {
    this.form.setValue({ name: this.seed().name });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.onUpdate.emit(this.form.getRawValue());
  }
}

export interface SeedFormValue {
  name: string;
}
