import { type Routes } from '@angular/router';

export const cardsRoutes: Routes = [
  {
    path: '',
    title: 'Cards - Akker',
    loadComponent: () => import('./cards-page.component').then(m => m.CardsPageComponent),
  },
];
