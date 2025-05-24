import { Component } from '@angular/core';
import {
  IonIcon,
  IonItem,
  IonList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
  imports: [IonList, IonItem, IonIcon],
})
export class SidebarComponent {
  isExpanded = false;

  constructor() {
    addIcons({ homeOutline });
  }

  expand() {
    this.isExpanded = true;
  }

  collapse() {
    this.isExpanded = false;
  }
}
