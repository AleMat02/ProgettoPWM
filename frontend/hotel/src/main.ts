import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { inject, provideAppInitializer } from '@angular/core';
import { AuthService } from './app/services/auth.service';

function initializeUser(): Promise<void> {
  const authService = inject(AuthService);
  return authService.loadUser();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideAppInitializer(initializeUser) //Serve perché altrimenti al refresh di una pagina lo user viene impostato a null, portando alla pagina di login nonostante ci siano le informazioni nel local storage
  ],
});
