import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-layout',
  template: `
    <div class="h-dvh flex flex-col overflow-hidden bg-primary">
      <main class="p-5 grow overflow-y-auto">
        <ng-content />
      </main>

      <nav class="shrink-0 border-t border-primary/50">
        <ul class="flex gap-2">
          @for (link of navigationLinks; track link.path) {
            <li>
              <!-- TODO: fix important usage -->
              <a class="text-secondary p-3 block" [routerLink]="link.path" routerLinkActive="!text-primary">
                {{ link.label }}
              </a>
            </li>
          }
        </ul>
      </nav>
    </div>
  `,
  imports: [RouterLink, RouterLinkActive],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  navigationLinks = [
    { path: '/planting', label: 'Planting' },
    { path: '/cultivating', label: 'Cultivating' },
  ];
}
