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
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, fromEvent, map, of, switchMap } from 'rxjs';

import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-dialog',
  template: `
    <dialog
      [ngClass]="[
        'bg-primary text-primary fixed top-0 grid h-full w-full p-5 pt-14 [max-block-size:unset] [max-inline-size:unset]',
        '[&:not([open])]:pointer-events-none',
        'transition-transform duration-300 [&:not([open])]:translate-x-full',
      ]"
      [inert]="!isOpen()"
      (close)="dismiss.emit()"
      #dialog
    >
      <!-- TODO: ui/button -->
      <button class="absolute top-2 right-2 flex p-2" aria-label="Close dialog" (click)="dialog.close()">
        <app-icon class="text-secondary size-6" name="crossInCircle" />
      </button>

      @if (isOpen()) {
        <ng-container *ngTemplateOutlet="contentRef()"></ng-container>
      }
    </dialog>
  `,
  imports: [IconComponent, NgTemplateOutlet, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  openInput = input(false, { alias: 'open' });
  dismiss = output();

  dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  contentRef = contentChild.required(TemplateRef);

  isOpen = toSignal(
    combineLatest([toObservable(this.openInput), toObservable(this.dialogRef)]).pipe(
      switchMap(([open, dialogRef]) =>
        open ? of(open) : fromEvent(dialogRef.nativeElement, 'transitionend').pipe(map(() => false)),
      ),
    ),
  );

  constructor() {
    effect(() => {
      if (this.openInput()) {
        this.dialogRef().nativeElement.showModal();
      } else {
        this.dialogRef().nativeElement.close();
      }
    });
  }
}
