import type { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'seeds', loadChildren: () => import('./planting/planting.routes').then(m => m.plantingRoutes) },
  {
    path: 'cards',
    loadChildren: () => import('./cultivating/cultivating.routes').then(m => m.cultivatingRoutes),
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.routes').then(m => m.settingsRoutes),
  },
  {
    path: '',
    loadChildren: () => import('./home/home.routes').then(m => m.homeRoutes),
  },

  // rest
  { path: '**', redirectTo: '/' },
];
