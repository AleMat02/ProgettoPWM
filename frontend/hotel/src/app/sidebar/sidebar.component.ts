import { Component } from '@angular/core';
import {
  IonIcon,
  IonItem,
  IonList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline } from 'ionicons/icons';
import { LayoutService } from '../shared/shared.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
  imports: [IonList, IonItem, IonIcon],
})
export class SidebarComponent {
  constructor(private layoutService: LayoutService) {
    addIcons({ homeOutline });
  }

  expand() {
    this.layoutService.setSidebarState(true)
  }

  collapse() {
    this.layoutService.setSidebarState(false)
  }
}
