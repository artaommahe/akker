import { Routes } from '@angular/router';

export const plantingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./planting-page.component').then(m => m.PlantingPageComponent),
  },
];
