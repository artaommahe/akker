import { ChangeDetectionStrategy, Component, type OnInit, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { type CardStats, CardStatsComponent } from '../../learning/card-stats/card-stats.component';
import { ButtonDirective } from '../../ui/button/button';
import { ExpansionPanelComponent } from '../../ui/expansion-panel/expansion-panel.component';
import { InputDirective } from '../../ui/input/input';

@Component({
  selector: 'app-sprout-details',
  template: `
    <form class="flex h-full flex-col gap-2" [formGroup]="form" (ngSubmit)="onSubmit()">
      <label class="flex flex-col">
        Term
        <input appInput type="text" formControlName="term" minlength="1" required />
      </label>
      <label class="flex flex-col">
        Full term (optional)
        <input appInput type="text" formControlName="fullTerm" />
      </label>
      <label class="flex flex-col">
        Definition
        <textarea appInput type="text" rows="4" formControlName="definition"></textarea>
      </label>

      <app-expansion-panel class="mt-4">
        <span class="text-secondary">FSRS stats</span>

        <ng-template>
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
    // TODO: ? check that term is not used by other sprouts
    term: ['', [Validators.minLength(1), Validators.required]],
    fullTerm: [''],
    definition: [''],
  });

  ngOnInit(): void {
    this.form.setValue({
      term: this.sprout().term,
      fullTerm: this.sprout().fullTerm ?? '',
      definition: this.sprout().definition,
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.update.emit({ ...this.form.getRawValue(), id: this.sprout().id });
  }
}

export interface SproutDetailsSprout {
  id: string;
  term: string;
  fullTerm?: string;
  definition: string;
  fsrs?: CardStats;
}
