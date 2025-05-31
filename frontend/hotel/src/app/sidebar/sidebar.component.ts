import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonIcon, IonItem, IonList } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bedOutline, compassOutline, homeOutline, peopleOutline, menuOutline,logOutOutline, calendarOutline} from 'ionicons/icons';
import { LayoutService } from '../shared/shared.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
  imports: [IonList, IonItem, IonIcon, RouterLink, RouterLinkActive /* IonButton se lo usi */],
})

export class SidebarComponent implements OnInit, OnDestroy {
  isSidebarExpanded = false; // Stato locale sincronizzato con LayoutService
  private layoutSubscription!: Subscription;

  role: string = '';
  isGuest: boolean = false; // Inizialmente impostato a false, cambia in base al ruolo

  constructor(private layoutService: LayoutService, private router: Router) {
    addIcons({ homeOutline, peopleOutline, menuOutline, compassOutline, bedOutline, logOutOutline, calendarOutline});

  }

  ngOnInit() {
    this.layoutSubscription = this.layoutService.sidebarState$.subscribe(
      state => (this.isSidebarExpanded = state)
    );

    Preferences.get({ key: 'userData' }).then((result) => {
        if (result.value) {
          const userData = JSON.parse(result.value).data;
          this.role = userData.role;
          console.log('Ruolo utente:', this.role);
          if(this.role === 'guest') {
            this.isGuest =  true;
          }
        }
      })
      .catch((err) => {
        console.error('Errore durante il recupero dei dati utente: ', err);
      });
  }
  

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  // Chiamato quando si clicca un item, per esempio per chiudere la sidebar su mobile
  //handleItemClick() {
    // Esempio: se vuoi che la sidebar si chiuda dopo un click su schermi piccoli
    // if (window.innerWidth < 768 && this.isSidebarExpanded) {
    //   this.layoutService.setSidebarState(false);
    // }
    // Oppure, se il click su un item deve espandere e "fissare" la sidebar:
    // if (!this.isSidebarExpanded) {
    //   this.layoutService.setSidebarState(true);
    // }
  //}

  ngOnDestroy() {
    if (this.layoutSubscription) {
      this.layoutSubscription.unsubscribe();
    }
  }
}