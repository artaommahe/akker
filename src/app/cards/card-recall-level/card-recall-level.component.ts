import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-card-recall-level',
  template: `
    @if (recallLevel() !== 'none') {
      <svg
        class="size-5 -rotate-90"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-25 -25 250 250"
        [attr.aria-label]="ariaLabel()"
      >
        <circle class="stroke-stroke-secondary" cx="100" cy="100" r="90" fill="transparent" stroke-width="24" />

        <circle
          [class]="segmentClass()"
          cx="100"
          cy="100"
          r="90"
          fill="transparent"
          stroke-dasharray="565.48"
          [attr.stroke-dashoffset]="segmentDashOffset()"
          stroke-linecap="round"
          stroke-width="24"
        />
      </svg>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardRecallLevelComponent {
  stability = input.required<number | undefined>();

  recallLevel = computed(() => getRecallLevel(this.stability()));
  segmentClass = computed(() => segmentClassMap[this.recallLevel()]);
  segmentDashOffset = computed(() => segmentDashOffsetMap[this.recallLevel()]);
  ariaLabel = computed(() => `Card recall level: ${this.recallLevel()}`);
}

type RecallLevel = 'bad' | 'good' | 'excellent' | 'none';

const segmentClassMap: Record<RecallLevel, string> = {
  bad: 'stroke-semantic-danger',
  good: 'stroke-semantic-warning',
  excellent: 'stroke-semantic-success',
  none: '',
};

const segmentDashOffsetMap: Record<RecallLevel, number> = {
  bad: 379,
  good: 192,
  excellent: 0,
  none: 0,
};

const recallLevelDays = {
  good: 7,
  excellent: 60,
};

const getRecallLevel = (stability: number | undefined): RecallLevel =>
  stability === undefined
    ? 'none'
    : stability >= recallLevelDays.excellent
      ? 'excellent'
      : stability >= recallLevelDays.good
        ? 'good'
        : 'bad';
