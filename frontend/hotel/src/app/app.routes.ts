import { Routes } from '@angular/router';

export const routes: Routes = [ //TODO: Fare refactoring con la parte /personnel
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage), //TODO: Da non loggati, se si prova ad accedere a /personnel/ si manda ad una pagina custom di Unauthorized. Altrimenti, per accedere a funzioni guests da non loggati, si rimanda a quella di login
    data: {
      title: 'Dashboard',
      breadcrumbs: [{ label: 'Dashboard', url: '/dashboard' }]
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage) //TODO: siccome non c'è un metodo nel back per visualizzare tutti gli utenti ed aggiungerli se non con la register, penso che vada integrata anche la navbar. Per la login volendo possiamo togliere sidebar e navbar
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
