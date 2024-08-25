import { ChangeDetectionStrategy, Component, ElementRef, type OnInit, output, viewChild } from '@angular/core';

import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-dialog',
  template: `
    <dialog
      class="m-0 h-full w-full bg-primary p-5 text-primary [max-block-size:unset] [max-inline-size:unset]"
      (close)="close.emit()"
      #dialog
    >
      <!-- TODO: ui/button -->
      <button class="absolute right-2 top-2 p-2" (click)="dialog.close()">
        <app-icon class="size-6 text-secondary" name="crossInCircle" />
      </button>

      <ng-content></ng-content>
    </dialog>
  `,
  imports: [IconComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements OnInit {
  close = output();

  dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  ngOnInit() {
    this.dialogRef().nativeElement.showModal();
  }
}
