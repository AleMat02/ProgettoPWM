import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'bookings',
    loadComponent: () => import('./pages/bookings/bookings.page').then(m => m.BookingsPage)
  },
  {
    path: 'add-booking',
    loadComponent: () => import('./pages/bookings/add-booking/add-booking.page').then( m => m.AddBookingPage)
  },
  {
    path: 'personnel/dashboard', //Usiamo le shared urls al posto delle nested urls come consigliato dalla documentazione Ionic
    loadComponent: () => import('./pages/personnel/dashboard/dashboard.page').then(m => m.DashboardPage),
    data: {
      title: 'Dashboard',
      breadcrumbs: [{ label: 'Dashboard', url: 'personnel/dashboard' }]
    }
  },
  {
    path: 'personnel/add-user',
    loadComponent: () => import('./pages/personnel/add-user/add-user.page').then(m => m.AddUserPage),
    data: {
      title: 'Crea Utente',
      breadcrumbs: [{ label: 'Crea Utente', url: 'personnel/add-user' }]
    }
  },
  {
    path: 'personnel/rooms',
    loadComponent: () => import('./pages/rooms/rooms.page').then(m => m.RoomsPage),
    data: {
      title: 'Stanze',
      breadcrumbs: [
        { label: 'Stanze', url: 'personnel/rooms' }
      ]
    }
  },
  {
    path: 'personnel/rooms/add',
    loadComponent: () => import('./pages/rooms/add-room/add-room.page').then(m => m.AddRoomPage),
    data: {
      title: 'Crea Stanza',
      breadcrumbs: [
        { label: 'Stanze', url: 'personnel/rooms' },
        { label: 'Crea Stanza', url: '/add' }
      ]
    }
  },
  {
    path: 'personnel/add-hotel',
    loadComponent: () => import('./pages/personnel/add-hotel/add-hotel.page').then(m => m.AddHotelPage),
    data: {
      title: 'Crea Hotel',
      breadcrumbs: [
        { label: 'Crea Hotel', url: '/add-hotel' }
      ]
    }
  },
  {
    path: 'nearby-hotels', //Sarà personnel?
    loadComponent: () => import('./pages/personnel/nearby-hotels/nearby-hotels.page').then(m => m.NearbyHotelsPage),
    data: {
      title: 'Hotel nelle vicinanze',
      breadcrumbs: [
        { label: 'Hotel nelle vicinanze', url: '/nearby-hotels' }
      ]
    }
  },
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.page').then( m => m.LandingPage)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
