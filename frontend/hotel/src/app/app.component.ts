import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { filter, map, mergeMap, Subscription } from 'rxjs';
import { LayoutService } from './shared/shared.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NavbarService } from './navbar/navbar.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, SidebarComponent, NavbarComponent],
})
export class AppComponent implements OnInit, OnDestroy {
  isSidebarExpanded = false;
  private sub!: Subscription;

  constructor(
    private layout: LayoutService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private navbarService: NavbarService
  ) { }

  ngOnInit() {
    this.sub = this.layout.sidebarState$.subscribe(
      state => (this.isSidebarExpanded = state)
    );

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(event => {
      // Aggiorna il servizio con i dati della rotta
      this.navbarService.setBreadcrumbs(event['breadcrumbs'] || []);
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
