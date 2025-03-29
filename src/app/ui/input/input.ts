import { Directive } from '@angular/core';
import clsx from 'clsx';

@Directive({
  selector: 'input[appInput], textarea[appInput]',
  host: {
    '[class]': 'defaultClasses',
    autocapitalize: 'off',
  },
  standalone: true,
})
export class InputDirective {
  defaultClasses = clsx(
    'rounded-lg border border-transparent bg-secondary p-2 outline-hidden caret-primary',
    'focus-visible:border-primary',
    'placeholder:text-secondary',
  );
}
