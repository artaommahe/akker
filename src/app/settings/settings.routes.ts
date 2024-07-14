import type { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
  {
    path: '',
    title: 'Settings - Akker',
    loadComponent: () => import('./settings-page.component').then(m => m.SettingsPageComponent),
  },
];
