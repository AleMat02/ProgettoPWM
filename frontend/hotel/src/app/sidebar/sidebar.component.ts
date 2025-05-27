import { Component } from '@angular/core';
import { IonIcon, IonItem, IonList } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bedOutline, compassOutline, homeOutline, peopleOutline } from 'ionicons/icons';
import { LayoutService } from '../shared/shared.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
  imports: [IonList, IonItem, IonIcon, RouterLink, RouterLinkActive],
})


export class SidebarComponent {
  constructor(private layoutService: LayoutService, private router: Router) {
    addIcons({ homeOutline, peopleOutline, bedOutline, compassOutline});
  }

  navigateIfNeeded(route: string, event: Event): void {
    if (this.router.url === route) {
      event.preventDefault(); // Blocca la navigazione
    }
  }

  expand() {
    this.layoutService.setSidebarState(true)
  }

  collapse() {
    this.layoutService.setSidebarState(false)
  }
}
