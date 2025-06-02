import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { distinctUntilChanged, filter, map, mergeMap, Subscription } from 'rxjs';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { NavbarService } from './components/navbar/navbar.service';
import { SidebarService } from './components/sidebar/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, SidebarComponent, NavbarComponent],
})
export class AppComponent implements OnInit, OnDestroy {
  isSidebarExpanded = false;
  private sidebarSub!: Subscription;
  private routerSub!: Subscription;

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private navbarService: NavbarService
  ) {}

  ngOnInit() {
    this.sidebarSub = this.sidebarService.sidebarState$.subscribe(
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
    if (this.sidebarSub) {
      this.sidebarSub.unsubscribe();
    }
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
