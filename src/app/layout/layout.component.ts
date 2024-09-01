import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-layout',
  template: `
    <div class="flex h-dvh flex-col overflow-hidden bg-primary text-primary">
      <main class="relative grow overflow-y-auto p-5">
        <ng-content />
      </main>

      <nav class="flex shrink-0 justify-between gap-2 border-t border-primary/10 px-2">
        @for (link of navigationLinks; track link.path) {
          <!-- TODO: fix important usage -->
          <a
            class="p-3 text-secondary"
            [routerLink]="link.path"
            routerLinkActive="!text-primary"
            [routerLinkActiveOptions]="link.options ?? { exact: false }"
          >
            {{ link.label }}
          </a>
        }
      </nav>
    </div>
  `,
  imports: [RouterLink, RouterLinkActive],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  navigationLinks = [
    { path: '/', label: 'Home', options: { exact: true } },
    { path: '/planting', label: 'Planting' },
    { path: '/cultivating', label: 'Cultivating' },
    { path: '/settings', label: 'Settings' },
  ];
}
