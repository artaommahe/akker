import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from 'src/environments/environment';

import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  template: `
    <app-layout>
      <router-outlet />
    </app-layout>
  `,
  host: {
    // NOTE: animations are disabled in testing to avoid issues with waiting for animations to finish
    '[class.**:!transition-none]': 'animationsDisabled',
  },
  imports: [RouterOutlet, LayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  animationsDisabled = environment.animationsDisabled;
}
