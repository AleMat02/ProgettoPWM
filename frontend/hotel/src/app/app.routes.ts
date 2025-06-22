import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';
import { UserRole } from './interfaces/user.interface';

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
    path: 'guest-rooms',
    loadComponent: () => import('./pages/guest-rooms/guest-rooms.page').then(m => m.GuestRoomsPage)
  },
  {
    path: 'guest-rooms/:hotelId',
    loadComponent: () => import('./pages/guest-rooms/guest-rooms.page').then(m => m.GuestRoomsPage)
  },
  {
    path: 'nearby-hotels',
    loadComponent: () => import('./pages/nearby-hotels/nearby-hotels.page').then(m => m.NearbyHotelsPage),
  },
  {
    path: 'user-booking-history',
    loadComponent: () => import('./pages/user-booking-history/user-booking-history.page').then(m => m.UserBookingHistoryPage),
    canActivate: [roleGuard([UserRole.Guest])]
  },
  {
    path: 'personnel/bookings-history', //Usiamo le shared urls al posto delle nested urls come consigliato dalla documentazione Ionic
    loadComponent: () => import('./pages/personnel/bookings-history/bookings-history.page').then(m => m.BookingsHistoryPage),
    canActivate: [roleGuard([UserRole.Admin, UserRole.Reception])]
  },
  {
    path: 'personnel/add-user',
    loadComponent: () => import('./pages/personnel/add-user/add-user.page').then(m => m.AddUserPage),
    canActivate: [roleGuard([UserRole.Admin])]
  },
  {
    path: 'personnel/rooms',
    loadComponent: () => import('./pages/personnel/rooms/rooms.page').then(m => m.RoomsPage),
    canActivate: [roleGuard([UserRole.Admin, UserRole.Reception])]
  },
  {
    path: 'personnel/rooms/add',
    loadComponent: () => import('./pages/personnel/rooms/add-room/add-room.page').then(m => m.AddRoomPage),
    canActivate: [roleGuard([UserRole.Admin])]
  },
  {
    path: 'personnel/hotels',
    loadComponent: () => import('./pages/personnel/hotels/hotels.page').then(m => m.HotelsPage),
    canActivate: [roleGuard([UserRole.Admin, UserRole.Reception])]
  },
  {
    path: 'personnel/hotels/add',
    loadComponent: () => import('./pages/personnel/hotels/add-hotel/add-hotel.page').then(m => m.AddHotelPage),
    canActivate: [roleGuard([UserRole.Admin])]
  },
  {
    path: 'personnel/booking-management',
    loadComponent: () => import('./pages/personnel/booking-management/booking-management.page').then(m => m.BookingManagementPage),
    canActivate: [roleGuard([UserRole.Admin, UserRole.Reception])]
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./pages/unauthorized/unauthorized.page').then(m => m.UnauthorizedPage)
  },
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.page').then(m => m.LandingPage)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
