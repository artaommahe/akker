import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ButtonDirective } from '../../ui/button/button';
import { BarnDbService } from '../../barn/barnDb.service';
import { IconComponent } from '../../ui/icon/icon';
import cross from '../../ui/modal/assets/cross.svg';
import { provideIcons } from '../../ui/icon/provide-icons';

@Component({
  selector: 'app-sync',
  template: `
    <div class="flex items-center justify-between gap-4">
      <button appButton (click)="backup()">Backup data</button>
      <button appButton (click)="showRestoreDialog.set(true)">Restore backup</button>
    </div>

    <!-- TODO: ui/dialog -->
    @if (showRestoreDialog()) {
      <div class="fixed inset-0 bg-primary p-5">
        <!-- TODO: ui/button -->
        <button class="absolute right-2 top-2 p-2" (click)="showRestoreDialog.set(false)">
          <app-icon class="size-6 text-secondary" name="cross" />
        </button>

        <div class="flex h-full flex-col gap-6 pt-8">
          <p class="text-lg">
            <span class="text-semantic-warning">WARNING:</span>
            restored data will be added on top of existing data
          </p>

          <label class="flex flex-col gap-2 text-secondary">
            Select backup file
            <input type="file" accept=".json" #backupFile />
          </label>

          <div class="mt-auto flex items-center justify-end gap-4">
            <button appButton (click)="showRestoreDialog.set(false)">Cancel</button>
            <button appButton appButtonType="warning" (click)="restore(backupFile)">Restore</button>
          </div>
        </div>
      </div>
    }
  `,
  imports: [ButtonDirective, IconComponent],
  providers: [provideIcons({ cross })],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyncComponent {
  private barnDb = inject(BarnDbService);

  showRestoreDialog = signal(false);

  async backup() {
    const data = await this.barnDb.exportJSON();

    const dataLink = document.createElement('a');
    dataLink.href = `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
    dataLink.download = `akker-export-data-${new Date().toISOString()}.json`;
    dataLink.click();
  }

  async restore(backupFileInput: HTMLInputElement) {
    if (!backupFileInput.files?.[0]) {
      return;
    }

    const fileContent = await readFileTextContent(backupFileInput.files[0]);
    const data = JSON.parse(fileContent);

    await this.barnDb.importJSON(data);

    this.showRestoreDialog.set(false);
  }
}

const readFileTextContent = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result as string);
    fileReader.onerror = () => reject(fileReader.error);
    fileReader.readAsText(file);
  });
};
