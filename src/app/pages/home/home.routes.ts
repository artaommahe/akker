import type { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: '',
    title: 'Akker',
    loadComponent: () => import('./home-page.component').then(m => m.HomePageComponent),
  },
];
