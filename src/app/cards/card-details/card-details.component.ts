import { ChangeDetectionStrategy, Component, type OnInit, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { type CardStats, CardStatsComponent } from '../../learning/card-stats/card-stats.component';
import { ButtonDirective } from '../../ui/button/button';
import { ExpansionPanelComponent } from '../../ui/expansion-panel/expansion-panel.component';
import { InputDirective } from '../../ui/input/input';

@Component({
  selector: 'app-card-details',
  template: `
    <form class="flex h-full flex-col gap-4" [formGroup]="form" (ngSubmit)="onSubmit()">
      <h2 class="text-xl">Card details</h2>

      <label class="flex flex-col gap-1">
        Term
        <input appInput type="text" formControlName="term" minlength="1" required />
      </label>

      <label class="flex flex-col gap-1">
        Full term (optional)
        <input appInput type="text" formControlName="fullTerm" />
      </label>

      <label class="flex flex-col gap-1">
        Definition
        <textarea appInput type="text" rows="4" formControlName="definition"></textarea>
      </label>

      <label class="flex flex-col gap-1">
        Tags (comma separated)
        <input appInput type="text" formControlName="tags" />
        <!-- TODO: create re-usable error-display component -->
        @if (form.get('tags')?.invalid && (form.get('tags')?.dirty || form.get('tags')?.touched)) {
          @if (form.get('tags')?.hasError('pattern')) {
            <p class="text-semantic-danger">Tags list can only contain letters, numbers, commas and spaces</p>
          }
        }
      </label>

      <app-expansion-panel class="mt-4">
        <span class="text-secondary">FSRS stats</span>

        <ng-template>
          @if (card().fsrs; as fsrs) {
            <app-card-stats [fsrs]="fsrs" />
          } @else {
            <p class="text-secondary">empty</p>
          }
        </ng-template>
      </app-expansion-panel>

      <div class="mt-auto flex gap-4">
        <button
          class="text-secondary mr-auto"
          type="button"
          appButton
          appButtonSemantic="warning"
          (click)="remove.emit()"
        >
          Remove
        </button>
        <button type="button" appButton (click)="dismiss.emit()">Cancel</button>
        <button type="submit" appButton appButtonType="primary">Save</button>
      </div>
    </form>
  `,
  imports: [ReactiveFormsModule, InputDirective, ButtonDirective, ExpansionPanelComponent, CardStatsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDetailsComponent implements OnInit {
  card = input.required<CardDetailsCard>();
  remove = output<void>();
  dismiss = output<void>();
  update = output<CardDetailsCard>();

  form = inject(NonNullableFormBuilder).group({
    // TODO: ? check that term is not used by other cards
    term: ['', [Validators.minLength(1), Validators.required]],
    fullTerm: [''],
    definition: [''],
    tags: ['', Validators.pattern(/^[a-zA-Z0-9,\s]*$/)],
  });

  ngOnInit() {
    this.form.setValue({
      term: this.card().term,
      fullTerm: this.card().fullTerm ?? '',
      definition: this.card().definition,
      tags: this.card().tags.join(', '),
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const formValue = this.form.getRawValue();

    this.update.emit({
      ...formValue,
      tags: formValue.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== ''),
      id: this.card().id,
    });
  }
}

export interface CardDetailsCard {
  id: string;
  term: string;
  fullTerm?: string;
  definition: string;
  tags: string[];
  fsrs?: CardStats;
}
