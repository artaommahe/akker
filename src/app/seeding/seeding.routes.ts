import { Routes } from '@angular/router';

export const seedingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./seeding-page.component').then(m => m.SeedingPageComponent),
  },
];
