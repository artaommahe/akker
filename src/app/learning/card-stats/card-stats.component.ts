import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { DbSprout } from '../../barn/rxdb/schema/sprouts';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-card-stats',
  template: `
    <section class="grid grid-cols-[max-content_auto] gap-2 text-secondary">
      <p>State</p>
      <p>{{ fsrs().card.state }}</p>
      <p>Next review</p>
      <p>{{ fsrs().card.due | date: 'medium' }}</p>
      <p>Last review</p>
      <p>{{ fsrs().card.last_review | date: 'medium' }}</p>
      <p>Repetitions</p>
      <p>{{ fsrs().card.reps }}</p>
      <p>Lapses</p>
      <p>{{ fsrs().card.lapses }}</p>
      <p>Stability</p>
      <p>{{ fsrs().card.stability }}</p>
      <p>Difficulty</p>
      <p>{{ fsrs().card.difficulty }}</p>
      <p>Elapsed days</p>
      <p>{{ fsrs().card.elapsed_days }}</p>
      <p>Scheduled days</p>
      <p>{{ fsrs().card.scheduled_days }}</p>
    </section>
  `,
  imports: [DatePipe],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardStatsComponent {
  fsrs = input.required<CardStats>();
}

export type CardStats = NonNullable<DbSprout['fsrs']>;
