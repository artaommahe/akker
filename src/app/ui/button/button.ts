import { Directive, computed, input } from '@angular/core';
import clsx from 'clsx';

@Directive({
  selector: 'button[appButton]',
  host: {
    '[class]': 'class()',
  },
  standalone: true,
})
export class ButtonDirective {
  type = input<'primary' | 'secondary' | 'warning'>('secondary', { alias: 'appButtonType' });

  class = computed(() =>
    clsx(
      'rounded-lg border px-3 py-2 outline-none',

      this.type() === 'primary' && [
        'border-transparent bg-action-primary',
        'hover:bg-inverse hover:text-inverse',
        'active:bg-tertiary active:text-primary',
        'focus-visible:border-primary',
      ],

      this.type() === 'secondary' && [
        'border-secondary',
        'hover:bg-inverse hover:text-inverse',
        'active:border-transparent active:bg-tertiary active:text-primary',
        'focus-visible:border-primary',
      ],

      this.type() === 'warning' && [
        'border-transparent text-semantic-warning',
        'hover:bg-semantic-warning hover:text-inverse',
        'active:bg-tertiary active:text-primary',
        'focus-visible:border-semantic-warning',
      ],
    ),
  );
}
