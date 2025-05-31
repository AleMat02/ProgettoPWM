import { Routes } from '@angular/router';

export const routes: Routes = [ //TODO: Fare refactoring con la parte /personnel
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage),
    data: {
      title: 'Dashboard',
      breadcrumbs: [{ label: 'Dashboard', url: '/dashboard' }]
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'rooms',
    loadComponent: () => import('./rooms/rooms.page').then(m => m.RoomsPage),
    data: {
      title: 'Stanze',
      breadcrumbs: [
        // { label: 'Dashboard', url: '/dashboard' }, esempio: se aggiunto visualizzerei Dashboard / Utenti
        { label: 'Stanze', url: '/rooms' }
      ]
    }
  },
  {
    path: 'nearby-hotels',
    loadComponent: () => import('./nearby-hotels/nearby-hotels.page').then(m => m.NearbyHotelsPage),
    data: {
      title: 'Hotel nelle vicinanze',
      breadcrumbs: [
        { label: 'Hotel nelle vicinanze', url: '/nearby-hotels' }
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
