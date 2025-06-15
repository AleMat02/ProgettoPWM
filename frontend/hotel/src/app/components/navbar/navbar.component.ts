import { Component, Input } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonButton, IonIcon } from '@ionic/angular/standalone';
import { NavbarService } from '../../services/navbar.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [IonIcon, IonButton, IonButtons,  
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonMenuButton
  ]
})
export class NavbarComponent {
  // title$: Observable<string>;

  constructor(private navbarService: NavbarService) {
    // this.title$ = this.navbarService.currentTitle$;
      // console.log(this.title$)
  }
}
