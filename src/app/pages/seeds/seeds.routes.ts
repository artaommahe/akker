import type { Routes } from '@angular/router';

export const seedsRoutes: Routes = [
  {
    path: '',
    title: 'Seeds - Akker',
    loadComponent: () => import('./seeds-page.component').then(m => m.SeedsPageComponent),
  },
];
