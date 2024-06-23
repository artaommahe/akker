import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-layout',
  template: `
    <div class="flex h-dvh flex-col overflow-hidden bg-primary text-primary">
      <main class="grow overflow-y-auto p-5">
        <ng-content />
      </main>

      <nav class="shrink-0 border-t border-primary/10">
        <ul class="flex gap-2">
          @for (link of navigationLinks; track link.path) {
            <li>
              <!-- TODO: fix important usage -->
              <a class="block p-3 text-secondary" [routerLink]="link.path" routerLinkActive="!text-primary">
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
