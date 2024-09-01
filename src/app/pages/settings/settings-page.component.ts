import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SyncComponent } from './sync/sync.component';

@Component({
  selector: 'app-settings-page',
  template: `
    <div class="flex flex-col gap-4">
      <h2 class="text-lg text-primary">Settings</h2>

      <app-sync />
    </div>
  `,
  imports: [SyncComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {}
