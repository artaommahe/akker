import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'planting', loadChildren: () => import('./planting/planting.routes').then(m => m.plantingRoutes) },
  { path: '', redirectTo: '/planting', pathMatch: 'full' },
];
