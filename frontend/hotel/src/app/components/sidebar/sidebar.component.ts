import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonIcon, IonItem, IonList } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bedOutline,
  compassOutline,
  homeOutline,
  peopleOutline,
  menuOutline,
  logOutOutline,
  calendarOutline,
  personAddOutline,
  businessOutline,
} from 'ionicons/icons';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
  imports: [
    IonList,
    IonItem,
    IonIcon,
    RouterLink,
    RouterLinkActive /* IonButton se lo usi */,
  ],
})
export class SidebarComponent implements OnInit, OnDestroy {
  isSidebarExpanded = false; // Stato locale sincronizzato con SidebarService
  private sidebarSub!: Subscription;

  role: string = '';
  isGuest: boolean = false; // Inizialmente impostato a false, cambia in base al ruolo

  constructor(private sidebarService: SidebarService, private router: Router) {
    addIcons({
      homeOutline,
      peopleOutline,
      menuOutline,
      compassOutline,
      bedOutline,
      logOutOutline,
      calendarOutline,
      personAddOutline,
      businessOutline
    });
  }

  ngOnInit() {
    this.sidebarSub = this.sidebarService.sidebarState$.subscribe(
      (state) => (this.isSidebarExpanded = state)
    );

    Preferences.get({ key: 'userData' })
      .then((result) => {
        if (result.value) {
          const userData = JSON.parse(result.value).data;
          this.role = userData.role;
          console.log('Ruolo utente:', this.role);
          if (this.role === 'guest') {
            this.isGuest = true;
          }
        }
      })
      .catch((err) => {
        console.error('Errore durante il recupero dei dati utente: ', err);
      });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  // Chiamato quando si clicca un item, per esempio per chiudere la sidebar su mobile
  //handleItemClick() {
  // Esempio: se vuoi che la sidebar si chiuda dopo un click su schermi piccoli
  // if (window.innerWidth < 768 && this.isSidebarExpanded) {
  //   this.sidebarService.setSidebarState(false);
  // }
  // Oppure, se il click su un item deve espandere e "fissare" la sidebar:
  // if (!this.isSidebarExpanded) {
  //   this.sidebarService.setSidebarState(true);
  // }
  //}

  logout() {
    Preferences.get({ key: 'userData' })
      .then((result) => {
        if (result.value) {
          Preferences.remove({ key: 'userData' })
            .then(() => {
              console.log('Logout effettuato con successo.');
              if (this.router.url !== '/register') {
                this.router.navigate(['/login']); // Reindirizza alla pagina di login
              }
            })
            .catch((err) => {
              console.error('Errore durante il logout: ', err);
            });
        } else {
          console.log('nessun utente loggato');
        }
      })
      .catch((err) => {
        console.error(
          'Errore durante il controllo dello stato di login: ',
          err
        );
      });
  }

  ngOnDestroy() {
    if (this.sidebarSub) {
      this.sidebarSub.unsubscribe();
    }
  }
}
