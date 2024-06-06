import { Routes } from '@angular/router';

export const plantingRoutes: Routes = [
  {
    path: '',
    title: 'Planting - Akker',
    loadComponent: () => import('./planting-page.component').then(m => m.PlantingPageComponent),
  },
];
