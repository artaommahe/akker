import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, contentChild, signal } from '@angular/core';

@Component({
  selector: 'app-expansion-panel',
  template: `
    <details (toggle)="isOpen.set(details.open)" #details>
      <summary class="text-lg"><ng-content></ng-content></summary>

      <ul class="flex flex-col gap-2">
        @if (isOpen()) {
          <ng-container *ngTemplateOutlet="contentRef()"></ng-container>
        }
      </ul>
    </details>
  `,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionPanelComponent {
  contentRef = contentChild.required(TemplateRef);

  isOpen = signal(false);
}
