import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, contentChild, input, output } from '@angular/core';
import clsx from 'clsx';

import { IconComponent } from '../icon/icon';
import { ModalComponent } from '../modal/modal.component';

/**
 * Wrapper for the `app-modal` component that provides a dialog with a close button and a specific open/close animation.
 */
@Component({
  selector: 'app-dialog',
  template: `
    <app-modal [open]="open()" [modalClass]="modalClass" (dismiss)="dismiss.emit()" #dialog>
      <!-- TODO: ui/button -->
      <button class="absolute top-2 right-2 flex p-2" aria-label="Close dialog" (click)="dialog.close()">
        <app-icon class="text-secondary size-6" name="crossInCircle" />
      </button>

      <ng-template>
        <ng-container *ngTemplateOutlet="contentRef()"></ng-container>
      </ng-template>
    </app-modal>
  `,
  imports: [IconComponent, NgTemplateOutlet, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  open = input(false);
  dismiss = output();

  contentRef = contentChild.required(TemplateRef);

  modalClass = clsx([
    'bg-primary text-primary fixed top-0 grid h-full w-full p-5 pt-14 [max-block-size:unset] [max-inline-size:unset]',
    '[&:not([open])]:pointer-events-none',
    'transition-transform duration-300 [&:not([open])]:translate-x-full',
  ]);
}
