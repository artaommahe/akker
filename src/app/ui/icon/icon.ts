import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { injectIcons } from './provide-icons';
import { DomSanitizer } from '@angular/platform-browser';
import clsx from 'clsx';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { globalIcons } from './global-icons';

@Component({
  selector: 'app-icon',
  template: ``,
  host: {
    '[class]': 'defaultClasses',
    '[innerHTML]': 'iconHtml()',
  },
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  private icons = injectIcons()[0];
  private sanitizer = inject(DomSanitizer);

  name = input.required<string>();

  defaultClasses = clsx('inline-block overflow-hidden');
  iconHtml = toSignal(
    toObservable(this.name).pipe(
      switchMap(name => {
        // local icons first
        const localIcon = this.icons?.[name];

        if (localIcon) {
          return typeof localIcon === 'string' ? Promise.resolve(localIcon) : localIcon();
        }

        // global icons
        if (name in globalIcons) {
          return globalIcons[name as keyof typeof globalIcons]();
        }

        throw new Error(`IconComponent: icon "${this.name()}" was not found`);
      }),
      map(icon => (typeof icon === 'string' ? icon : icon.default)),
      map(icon => this.sanitizer.bypassSecurityTrustHtml(icon)),
    ),
  );
}
