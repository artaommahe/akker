import { ChangeDetectionStrategy, Component, type OnInit, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputDirective } from '../../ui/input/input';
import { ButtonDirective } from '../../ui/button/button';
import { ExpansionPanelComponent } from '../../ui/expansion-panel/expansion-panel.component';
import { CardStatsComponent, type CardStats } from '../../learning/card-stats/card-stats.component';

@Component({
  selector: 'app-sprout-details',
  template: `
    <form class="flex h-full flex-col gap-2" [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>
        Name
        <input appInput type="text" formControlName="name" minlength="1" required />
      </label>

      <app-expansion-panel class="mt-4">
        <span class="text-secondary">FSRS stats</span>

        <ng-template #content>
          @if (sprout().fsrs; as fsrs) {
            <app-card-stats [fsrs]="fsrs" />
          } @else {
            <span class="text-secondary">empty</span>
          }
        </ng-template>
      </app-expansion-panel>

      <div class="mt-auto flex gap-4">
        <button
          class="mr-auto text-secondary"
          type="button"
          appButton
          appButtonSemantic="warning"
          (click)="remove.emit()"
        >
          Remove
        </button>
        <button type="button" appButton (click)="cancel.emit()">Cancel</button>
        <button type="submit" appButton appButtonType="primary">Save</button>
      </div>
    </form>
  `,
  imports: [ReactiveFormsModule, InputDirective, ButtonDirective, ExpansionPanelComponent, CardStatsComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SproutDetailsComponent implements OnInit {
  sprout = input.required<SproutDetailsSprout>();
  remove = output<void>();
  cancel = output<void>();
  update = output<SproutDetailsSprout>();

  form = inject(NonNullableFormBuilder).group({
    // TODO: ? check that name is not used by other sprouts
    name: ['', [Validators.minLength(1), Validators.required]],
  });

  ngOnInit(): void {
    this.form.setValue({ name: this.sprout().name });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.update.emit(this.form.getRawValue());
  }
}

export interface SproutDetailsSprout {
  name: string;
  fsrs?: CardStats;
}
