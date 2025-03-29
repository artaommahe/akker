import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-layout',
  template: `
    <div class="bg-primary text-primary flex h-dvh flex-col overflow-hidden">
      <main class="relative grow overflow-y-auto p-5">
        <ng-content />
      </main>

      <nav class="border-primary/10 flex shrink-0 justify-between gap-2 border-t px-2">
        @for (link of navigationLinks; track link.path) {
          <!-- TODO: fix important usage -->
          <a
            class="text-secondary p-3"
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  navigationLinks = [
    { path: '/', label: 'Home', options: { exact: true } },
    { path: '/seeds', label: 'Seeds' },
    { path: '/cards', label: 'Cards' },
    { path: '/settings', label: 'Settings' },
  ];
}
