import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, contentChild, signal, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-expansion-panel',
  template: `
    <details (toggle)="isOpen.set(details.open)" #details>
      <summary class="text-lg"><ng-content></ng-content></summary>

      <ul class="flex flex-col gap-2">
        @if (isOpen()) {
          <ng-container *ngTemplateOutlet="content() ?? null"></ng-container>
        }
      </ul>
    </details>
  `,
  imports: [NgTemplateOutlet],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionPanelComponent {
  content = contentChild<TemplateRef<unknown>>('content');

  isOpen = signal(false);
}
