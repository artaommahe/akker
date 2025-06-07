import { ChangeDetectionStrategy, Component, type OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BarnDemoService } from './barn/barn-demo.service';
import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  template: `
    <app-layout>
      <router-outlet />
    </app-layout>
  `,
  imports: [RouterOutlet, LayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private barnDemoService = inject(BarnDemoService);

  ngOnInit() {
    this.barnDemoService.init();
  }
}
