import type { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'planting', loadChildren: () => import('./planting/planting.routes').then(m => m.plantingRoutes) },
  {
    path: 'cultivating',
    loadChildren: () => import('./cultivating/cultivating.routes').then(m => m.cultivatingRoutes),
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.routes').then(m => m.settingsRoutes),
  },
  { path: '', redirectTo: '/planting', pathMatch: 'full' },
];
