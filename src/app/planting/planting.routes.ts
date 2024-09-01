import type { Routes } from '@angular/router';

export const plantingRoutes: Routes = [
  {
    path: '',
    title: 'Seeds - Akker',
    loadComponent: () => import('./planting-page.component').then(m => m.PlantingPageComponent),
  },
];
