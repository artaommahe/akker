import type { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'seeds', loadChildren: () => import('./pages/seeds/seeds.routes').then(m => m.seedsRoutes) },
  {
    path: 'cards',
    loadChildren: () => import('./pages/cards/cards.routes').then(m => m.cardsRoutes),
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.routes').then(m => m.settingsRoutes),
  },
  {
    path: '',
    loadChildren: () => import('./pages/home/home.routes').then(m => m.homeRoutes),
  },

  // rest
  { path: '**', redirectTo: '/' },
];
