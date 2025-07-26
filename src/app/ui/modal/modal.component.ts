import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  computed,
  contentChild,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import clsx from 'clsx';
import { combineLatest, delay, fromEvent, map, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Base modal component that can be used to create dialogs and other modal windows.
 * Uses the native `<dialog>` element just for fun and learning purposes.
 *
 * NOTE: if modal has no animation, the `transition-none` class should be explicitly added to the `modalClass` input
 * */
@Component({
  selector: 'app-modal',
  template: `
    <!-- eslint-disable @angular-eslint/template/click-events-have-key-events -->
    <!-- eslint-disable @angular-eslint/template/interactive-supports-focus -->
    <dialog
      [class]="modalClass()"
      [inert]="!isOpen()"
      (click)="handleBackdropClick($event)"
      (close)="dismiss.emit()"
      #dialog
    >
      @if (isOpen()) {
        <ng-container *ngTemplateOutlet="contentRef()"></ng-container>
      }
    </dialog>
  `,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  openInput = input.required<boolean>({ alias: 'open' });
  // eslint-disable-next-line @angular-eslint/no-input-rename
  modalClassInput = input<string | undefined>(undefined, { alias: 'modalClass' });
  dismiss = output();

  dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  contentRef = contentChild.required(TemplateRef);

  modalClass = computed(() =>
    clsx(
      'bg-primary text-primary fixed [max-block-size:unset] [max-inline-size:unset]',
      '[&:not([open])]:pointer-events-none',
      this.modalClassInput() ?? '',
    ),
  );

  isAnimated = toObservable(this.dialogRef).pipe(
    // without this delay `getComputedStyle().transition` always returns `all` for some reason
    delay(0),
    map(dialogRef => {
      const dialogAnimationExists = window.getComputedStyle(dialogRef.nativeElement).transition !== 'none';

      return dialogAnimationExists && !environment.animationsDisabled;
    }),
  );
  isOpen = toSignal(
    combineLatest([toObservable(this.openInput), toObservable(this.dialogRef), this.isAnimated]).pipe(
      switchMap(([open, dialogRef, isAnimated]) => {
        return open || !isAnimated
          ? of(open)
          : // we should wait for the modal animation to finish before removing modal's content from the DOM
            fromEvent(dialogRef.nativeElement, 'transitionend').pipe(map(() => false));
      }),
    ),
  );

  constructor() {
    effect(() => {
      if (this.openInput()) {
        this.dialogRef().nativeElement.showModal();
      } else {
        this.close();
      }
    });
  }

  handleBackdropClick(event: MouseEvent) {
    if (event.target === this.dialogRef().nativeElement) {
      this.close();
    }
  }

  close() {
    this.dialogRef().nativeElement.close();
  }
}
