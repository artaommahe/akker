import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { Sprout } from '../../barn/barn.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sprout-details',
  template: `
    <form class="flex flex-col gap-2 h-full" [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>
        Name
        <input type="text" formControlName="name" minlength="1" required />
      </label>

      <div class="flex gap-4 mt-auto">
        <button class="text-text-secondary mr-auto" type="button" (click)="onRemove.emit()">Remove</button>
        <button type="button" (click)="onCancel.emit()">Cancel</button>
        <button type="submit">Save</button>
      </div>
    </form>
  `,
  imports: [ReactiveFormsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SproutDetailsComponent implements OnInit {
  sprout = input.required<Sprout>();
  onRemove = output<void>();
  onCancel = output<void>();
  onUpdate = output<SproutFormValue>();

  form = inject(NonNullableFormBuilder).group({
    // TODO: check that name is not used by other sprouts
    name: ['', [Validators.minLength(1), Validators.required]],
  });

  ngOnInit(): void {
    this.form.setValue({ name: this.sprout().name });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.onUpdate.emit(this.form.getRawValue());
  }
}

export interface SproutFormValue {
  name: string;
}
