import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'seeding', loadChildren: () => import('./seeding/seeding.routes').then(m => m.seedingRoutes) },
  { path: '', redirectTo: '/seeding', pathMatch: 'full' },
];
