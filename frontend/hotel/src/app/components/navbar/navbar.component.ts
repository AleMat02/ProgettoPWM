import { Component, Input } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileMenuComponent } from '../profile-menu/profile-menu.component';
import { PopoverController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    IonIcon, 
    IonButton, 
    IonButtons,
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonMenuButton,
    ProfileMenuComponent,
  ]
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  userSub!: Subscription

  constructor(private authService: AuthService, private popoverController: PopoverController) {
    this.userSub = this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user
    })
  }

  async presentPopover(e: Event) {
    const popover = await this.popoverController.create({
      component: ProfileMenuComponent,
      event: e,
      side: 'bottom', // Fa apparire il popover sotto il pulsante
    });
    await popover.present();
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
