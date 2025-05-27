import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { distinctUntilChanged, filter, map, mergeMap, Subscription } from 'rxjs';
import { LayoutService } from './shared/shared.service';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { NavbarService } from './navbar/navbar.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, SidebarComponent, NavbarComponent],
})
export class AppComponent implements OnInit, OnDestroy {
  isSidebarExpanded = false;
  private layoutSub!: Subscription;
  private routerSub!: Subscription;

  constructor(
    private layout: LayoutService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private navbarService: NavbarService
  ) {}

  ngOnInit() {
    this.layoutSub = this.layout.sidebarState$.subscribe(
      state => (this.isSidebarExpanded = state)
    );

    this.routerSub = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd), // Type guard per NavigationEnd
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data), // route.data è Observable<Data>
      // Evita emissioni multiple se i breadcrumbs non cambiano
      distinctUntilChanged((prev, curr) => JSON.stringify(prev['breadcrumbs']) === JSON.stringify(curr['breadcrumbs']))
    ).subscribe((eventData: Data) => {
      this.navbarService.setBreadcrumbs(eventData['breadcrumbs'] || []);
    });
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
