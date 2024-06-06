import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cultivating-page',
  template: `
    <div class="flex flex-col gap-4">123</div>
  `,
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CultivatingPageComponent {}
