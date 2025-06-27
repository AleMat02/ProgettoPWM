import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonSplitPane, IonLabel, IonMenu, IonItem, IonIcon, IonContent, IonList } from '@ionic/angular/standalone';
import { NavbarComponent } from './components/navbar/navbar.component';
import { filter, Subscription } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, alertCircleOutline, bedOutline, businessOutline, calendarOutline, compassOutline, homeOutline, logOutOutline, menuOutline, peopleOutline, personAddOutline, addOutline, trashOutline, sadOutline, personCircleOutline, lockClosedOutline, albumsOutline, closeCircleOutline } from 'ionicons/icons';
import { AuthService } from './services/auth.service';
import { UserRole } from './interfaces/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  imports: [IonLabel, IonSplitPane, IonApp, IonRouterOutlet, NavbarComponent, IonMenu, IonItem, IonIcon, IonContent, IonList, RouterModule], //Senza router module non funzionerebbero le rotte nell'html
})
export class AppComponent implements OnInit, OnDestroy {
  showPersonnelLayout = false;
  isAdmin = false;
  private routerSub!: Subscription;
  private userSub!: Subscription

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
      sadOutline,
      personCircleOutline,
      lockClosedOutline,
      albumsOutline,
      closeCircleOutline
    })
  }

  async ngOnInit() {
    this.routerSub = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.showPersonnelLayout = event.urlAfterRedirects.startsWith('/personnel/')
    })

    this.userSub = this.authService.user$.subscribe(user =>
      this.isAdmin = user ? user.role === UserRole.Admin : false
    );
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    
    this.userSub.unsubscribe()
  }
}
