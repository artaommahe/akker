import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ButtonDirective } from '../../ui/button/button';
import { BarnDbService } from '../../barn/barnDb.service';

@Component({
  selector: 'app-sync',
  template: `
    <div class="flex items-center gap-4">
      <button appButton (click)="export()">Export data</button>

      @let data = barnData();
      @if (data) {
        <a
          class="text-action-primary underline"
          [href]="'data:text/plain;charset=utf-8,' + data.fileContent"
          [download]="data.fileName"
        >
          download
        </a>
      }
    </div>
  `,
  imports: [ButtonDirective],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyncComponent {
  private barnDb = inject(BarnDbService);

  barnData = signal<{ fileName: string; fileContent: string } | null>(null);

  async export() {
    const data = await this.barnDb.exportJSON();

    this.barnData.set({
      fileName: `akker-export-data-${new Date().toISOString()}.json`,
      fileContent: encodeURIComponent(JSON.stringify(data)),
    });
  }
}
