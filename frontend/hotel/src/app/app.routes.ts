import { Routes } from '@angular/router';

export const routes: Routes = [

  
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage)
  },  
  {
    path: 'nearby-hotels',
    loadComponent: () => import('./nearby-hotels/nearby-hotels.page').then( m => m.NearbyHotelsPage)
  },
  {
    path: 'users',
    loadComponent: () => import('./users/users.page').then(m => m.UsersPage)
  },
  {
    path: 'rooms',
    loadComponent: () => import('./rooms/rooms.page').then(m => m.RoomsPage)
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
