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
import { environment } from 'src/environments/environment';

/**
 * Base modal component that can be used to create dialogs and other modal windows.
 * Uses the native `<dialog>` element just for fun and learning purposes.
 * */
@Component({
  selector: 'app-modal',
  template: `
    <dialog
      [ngClass]="[
        'bg-primary text-primary fixed [max-block-size:unset] [max-inline-size:unset]',
        '[&:not([open])]:pointer-events-none',
        modalClass() ?? '',
      ]"
      [inert]="!isOpen()"
      (close)="dismiss.emit()"
      #dialog
    >
      @if (isOpen()) {
        <ng-container *ngTemplateOutlet="contentRef()"></ng-container>
      }
    </dialog>
  `,
  imports: [NgTemplateOutlet, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  openInput = input(false, { alias: 'open' });
  modalClass = input<string | undefined>(undefined);
  dismiss = output();

  dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  contentRef = contentChild.required(TemplateRef);

  isOpen = toSignal(
    combineLatest([toObservable(this.openInput), toObservable(this.dialogRef)]).pipe(
      switchMap(([open, dialogRef]) =>
        open || environment.animationsDisabled
          ? of(open)
          : fromEvent(dialogRef.nativeElement, 'transitionend').pipe(map(() => false)),
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

  close() {
    this.dialogRef().nativeElement.close();
  }
}
