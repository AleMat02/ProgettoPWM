import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { distinctUntilChanged, filter, map, mergeMap, Subscription } from 'rxjs';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { NavbarService } from './services/navbar.service';
import { SidebarService } from './services/sidebar.service';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, alertCircleOutline, bedOutline, businessOutline, calendarOutline, compassOutline, homeOutline, logOutOutline, menuOutline, peopleOutline, personAddOutline, addOutline, trashOutline, createOutline, sadOutline } from 'ionicons/icons';

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
  ) {
    //Definiamo le icone utilizzate nell'applicazione tutte in un unico luogo per evitare ridondanze e rendere più pulito il codice
    addIcons({
      checkmarkCircleOutline,
      alertCircleOutline,
      homeOutline,
      peopleOutline,
      menuOutline,
      compassOutline,
      bedOutline,
      logOutOutline,
      calendarOutline,
      personAddOutline,
      businessOutline,
      addOutline,
      trashOutline,
      sadOutline
    })
  }

  ngOnInit() {
    this.sidebarSub = this.sidebarService.sidebarState$.subscribe(
      state => (this.isSidebarExpanded = state)
    );
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
