---
name: angular-routing
description: Angular routing patterns including lazy loading, loadComponent, loadChildren, and route configuration. Use when creating or modifying route files (.routes.ts).
---

# Angular Routing

Routing patterns for Angular applications.

## Core Patterns

### Lazy-Loaded Feature Routes

Use `loadChildren` for feature modules and `loadComponent` for individual routes.

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'seeds', loadChildren: () => import('./pages/seeds/seeds.routes').then(m => m.seedsRoutes) },
  { path: 'cards', loadChildren: () => import('./pages/cards/cards.routes').then(m => m.cardsRoutes) },
  { path: 'settings', loadChildren: () => import('./pages/settings/settings.routes').then(m => m.settingsRoutes) },
  { path: '', loadChildren: () => import('./pages/home/home.routes').then(m => m.homeRoutes) },
  { path: '**', redirectTo: '/' },
];
```

### Feature Route Files

Each feature has its own route file with typed Routes array.

```typescript
// src/app/pages/cards/cards.routes.ts
import { Routes } from '@angular/router';

export const cardsRoutes: Routes = [
  {
    path: '',
    title: 'Cards - Akker',
    loadComponent: () => import('./cards-page.component').then(m => m.CardsPageComponent),
  },
];
```

### Route Titles

Use the `title` property for page titles.

```typescript
export const cardsRoutes: Routes = [
  {
    path: '',
    title: 'Cards - Akker',
    loadComponent: () => import('./cards-page.component').then(m => m.CardsPageComponent),
  },
];

export const homeRoutes: Routes = [
  {
    path: '',
    title: 'Akker',
    loadComponent: () => import('./home-page.component').then(m => m.HomePageComponent),
  },
];
```

### Multiple Routes in Feature

```typescript
export const settingsRoutes: Routes = [
  {
    path: '',
    title: 'Settings - Akker',
    loadComponent: () => import('./settings-page.component').then(m => m.SettingsPageComponent),
  },
  {
    path: 'sync',
    title: 'Sync - Akker',
    loadComponent: () => import('./sync/sync.component').then(m => m.SyncComponent),
  },
];
```

### Route with Children and Outlet

```typescript
export const routes: Routes = [
  {
    path: 'admin',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent) },
      { path: 'users', loadComponent: () => import('./users.component').then(m => m.UsersComponent) },
    ],
  },
];
```

### Router Configuration in App Config

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withHashLocation())],
};
```

## Directory Structure

```
src/app/
├── app.routes.ts              # Root routes
├── app.config.ts              # Router provider config
└── pages/
    ├── cards/
    │   ├── cards.routes.ts
    │   └── cards-page.component.ts
    ├── home/
    │   ├── home.routes.ts
    │   └── home-page.component.ts
    ├── seeds/
    │   ├── seeds.routes.ts
    │   └── seeds-page.component.ts
    └── settings/
        ├── settings.routes.ts
        └── settings-page.component.ts
```

## Reference Files

- `src/app/app.routes.ts` - Root route configuration
- `src/app/app.config.ts` - Router provider setup
- `src/app/pages/cards/cards.routes.ts` - Feature route example
- `src/app/pages/settings/settings.routes.ts` - Feature with nested routes
