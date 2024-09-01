import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  contentChild,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';

import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-dialog',
  template: `
    <dialog
      [ngClass]="[
        'fixed top-0 grid h-full w-full bg-primary p-5 pt-16 text-primary [max-block-size:unset] [max-inline-size:unset]',
        '[&:not([open])]:pointer-events-none',
        'transition-transform duration-300 [&:not([open])]:translate-x-full',
      ]"
      [inert]="!open()"
      (close)="close.emit()"
      #dialog
    >
      <!-- TODO: ui/button -->
      <button class="absolute right-2 top-2 flex p-2" (click)="dialog.close()">
        <app-icon class="size-6 text-secondary" name="crossInCircle" />
      </button>

      <ng-container *ngTemplateOutlet="contentRef()"></ng-container>
    </dialog>
  `,
  imports: [IconComponent, NgTemplateOutlet, NgClass],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  open = input(false);
  close = output();

  dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  contentRef = contentChild.required(TemplateRef);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.dialogRef().nativeElement.showModal();
      } else {
        this.dialogRef().nativeElement.close();
      }
    });
  }
}
