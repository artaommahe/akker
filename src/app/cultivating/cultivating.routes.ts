import { type Routes } from '@angular/router';

export const cultivatingRoutes: Routes = [
  {
    path: '',
    title: 'Cards - Akker',
    loadComponent: () => import('./cultivating-page.component').then(m => m.CultivatingPageComponent),
  },
];
