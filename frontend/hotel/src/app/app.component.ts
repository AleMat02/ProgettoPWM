import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { NavbarComponent } from './components/navbar/navbar.component';
import { distinctUntilChanged, filter, map, mergeMap, Subscription } from 'rxjs';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { NavbarService } from './services/navbar.service';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, alertCircleOutline, bedOutline, businessOutline, calendarOutline, compassOutline, homeOutline, logOutOutline, menuOutline, peopleOutline, personAddOutline, addOutline, trashOutline, createOutline, sadOutline } from 'ionicons/icons';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, NavbarComponent],
})
export class AppComponent implements OnInit, OnDestroy {
  showPersonnelLayout = false;
  private routerSub!: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private navbarService: NavbarService,
    private authService: AuthService
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

  async ngOnInit() {
      this.routerSub = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
        this.showPersonnelLayout = event.urlAfterRedirects.startsWith('/personnel/')
      })

      await this.authService.loadUser()
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
