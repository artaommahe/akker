import { Directive, computed, input } from '@angular/core';
import clsx from 'clsx';

@Directive({ selector: 'button[appButton]', host: { '[class]': 'class()' }, standalone: true })
export class ButtonDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  type = input<'primary' | 'secondary'>('secondary', { alias: 'appButtonType' });
  // eslint-disable-next-line @angular-eslint/no-input-rename
  semantic = input<'success' | 'warning' | 'danger' | undefined>(undefined, { alias: 'appButtonSemantic' });

  class = computed(() =>
    clsx(
      'rounded-lg border px-3 py-2 outline-hidden',

      this.type() === 'primary' && [
        'border-transparent bg-action-primary text-primary',
        'hover:bg-inverse hover:text-inverse',
        'active:bg-tertiary active:text-primary',
        'focus-visible:border-primary',
      ],

      this.type() === 'secondary' && [
        !this.semantic() && [
          'border-secondary text-primary',
          'hover:bg-inverse hover:text-inverse',
          'active:border-transparent active:bg-tertiary active:text-primary',
          'focus-visible:border-primary',
        ],
        this.semantic() === 'warning' && [
          'border-semantic-warning text-semantic-warning',
          'hover:bg-semantic-warning hover:text-primary',
          'active:border-transparent active:bg-tertiary active:text-semantic-warning',
          'focus-visible:border-primary',
        ],
        this.semantic() === 'danger' && [
          'border-semantic-danger text-semantic-danger',
          'hover:bg-semantic-danger hover:text-primary',
          'active:border-transparent active:bg-tertiary active:text-semantic-danger',
          'focus-visible:border-primary',
        ],
        this.semantic() === 'success' && [
          'border-semantic-success text-semantic-success',
          'hover:bg-semantic-success hover:text-primary',
          'active:border-transparent active:bg-tertiary active:text-semantic-success',
          'focus-visible:border-primary',
        ],
      ],
    ),
  );
}
