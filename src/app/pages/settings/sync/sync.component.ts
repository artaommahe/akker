import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BarnDbService } from 'src/app/barn/barn-db.service';

import { ButtonDirective } from '../../../ui/button/button';
import { DialogComponent } from '../../../ui/dialog/dialog.component';

@Component({
  selector: 'app-sync',
  template: `
    <div class="flex items-center justify-between gap-4">
      <button appButton (click)="backup()">Backup data</button>
      <button appButton (click)="showRestoreDialog.set(true)">Restore backup</button>
    </div>

    <app-dialog [open]="showRestoreDialog()" (dismiss)="showRestoreDialog.set(false)">
      <ng-template>
        <div class="flex h-full flex-col gap-6 pt-8">
          <p class="text-lg">
            <span class="text-semantic-warning">WARNING:</span>
            restored data will be added on top of existing data
          </p>

          <label class="text-secondary flex flex-col gap-2">
            Select backup file
            <input type="file" accept=".json" #backupFile />
          </label>

          <div class="mt-auto flex items-center justify-end gap-4">
            <button appButton (click)="showRestoreDialog.set(false)">Cancel</button>
            <button appButton appButtonSemantic="warning" (click)="restore(backupFile)">Restore</button>
          </div>
        </div>
      </ng-template>
    </app-dialog>
  `,
  imports: [ButtonDirective, DialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyncComponent {
  private barnDbService = inject(BarnDbService);

  showRestoreDialog = signal(false);

  async backup() {
    const db = await this.barnDbService.getDb();
    const data = await db.exportJSON();

    const dataLink = document.createElement('a');
    dataLink.href = `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
    dataLink.download = `akker-export-data-${new Date().toISOString()}.json`;
    dataLink.click();
  }

  async restore(backupFileInput: HTMLInputElement) {
    if (!backupFileInput.files?.[0]) {
      return;
    }

    const db = await this.barnDbService.getDb();

    const fileContent = await readFileTextContent(backupFileInput.files[0]);
    const data = JSON.parse(fileContent);

    await db.importJSON(data);

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
