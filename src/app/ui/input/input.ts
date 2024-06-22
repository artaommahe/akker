import { Directive } from '@angular/core';

@Directive({
  selector: 'input[appInput], textarea[appInput]',
  host: {
    class:
      'p-2 border border-transparent bg-secondary rounded-lg outline-none placeholder:text-secondary focus-visible:border-primary',
  },
  standalone: true,
})
export class InputDirective {}
