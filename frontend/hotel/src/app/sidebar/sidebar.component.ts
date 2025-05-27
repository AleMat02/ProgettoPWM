import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonIcon, IonItem, IonList } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bedOutline, compassOutline, homeOutline, peopleOutline, menuOutline } from 'ionicons/icons';
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

  constructor(private layoutService: LayoutService, private router: Router) {
    addIcons({ homeOutline, peopleOutline, menuOutline, compassOutline, bedOutline });

  }

  ngOnInit() {
    this.layoutSubscription = this.layoutService.sidebarState$.subscribe(
      state => (this.isSidebarExpanded = state)
    );
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