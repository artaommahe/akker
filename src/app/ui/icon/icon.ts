import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { injectIcons } from './provide-icons';
import { DomSanitizer } from '@angular/platform-browser';
import clsx from 'clsx';

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
  private icons = injectIcons();
  private sanitizer = inject(DomSanitizer);

  name = input.required<string>();

  defaultClasses = clsx('inline-block overflow-hidden');
  iconHtml = computed(() => {
    const icon = this.icons[0]?.[this.name()];

    if (!icon) {
      throw new Error(`IconComponent: icon "${this.name()}" was not found`);
    }

    return this.sanitizer.bypassSecurityTrustHtml(icon);
  });
}
