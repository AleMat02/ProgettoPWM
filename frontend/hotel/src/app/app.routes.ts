import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage),
    data: {
      title: 'Dashboard',
      breadcrumbs: [{ label: 'Dashboard', url: '/dashboard' }]
    }
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users.page').then(m => m.UsersPage),
    data: {
      title: 'Utenti',
      breadcrumbs: [
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Utenti', url: '/users' }
      ]
    }
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
