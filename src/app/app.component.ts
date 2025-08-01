import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from 'src/environments/environment';

import { LayoutComponent } from './layout/layout.component';
import { ApplicationLoaderService } from './ui/application-loader/application-loader.service';

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
  private applicationLoaderService = inject(ApplicationLoaderService);

  animationsDisabled = environment.animationsDisabled;

  constructor() {
    this.applicationLoaderService.removeLoader();
  }
}
