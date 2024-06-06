import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'planting', loadChildren: () => import('./planting/planting.routes').then(m => m.plantingRoutes) },
  {
    path: 'cultivating',
    loadChildren: () => import('./cultivating/cultivating.routes').then(m => m.cultivatingRoutes),
  },
  { path: '', redirectTo: '/planting', pathMatch: 'full' },
];
