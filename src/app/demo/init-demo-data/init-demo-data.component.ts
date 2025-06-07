import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BarnService } from '../../barn/barn.service';
import { ButtonDirective } from '../../ui/button/button';
import { DemoDataService } from '../demo-data.service';

@Component({
  selector: 'app-init-demo-data',
  template: `
    @if (barnIsEmpty()) {
      <button appButton [appButtonType]="'primary'" (click)="initDemo()">Load demo data</button>
    }
  `,
  imports: [ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InitDemoDataComponent {
  private demoService = inject(DemoDataService);
  private barnService = inject(BarnService);

  barnIsEmpty = computed(() => this.barnService.cards()?.length === 0 && this.barnService.seeds()?.length === 0);

  initDemo() {
    this.demoService.initDemoData();
  }
}
