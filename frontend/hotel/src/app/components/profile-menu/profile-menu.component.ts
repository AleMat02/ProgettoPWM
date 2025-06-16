import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonList, IonItem, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { PopoverController } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { UserRole } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-profile-menu',
    templateUrl: './profile-menu.component.html',
    styleUrls: ['./profile-menu.component.scss'],
    imports: [IonLabel, IonIcon, IonList, IonItem],
})
export class ProfileMenuComponent {
    isGuest: boolean = true;
    userSub!: Subscription;

    constructor(
        private router: Router,
        private popoverController: PopoverController,
        private authService: AuthService
    ) {
        this.userSub = this.authService.user$.subscribe(user => {
            this.isGuest = user?.role === UserRole.Guest;
        })
    }

    goToBookings() {
        this.router.navigate(['/bookings/personal']); //TODO: Sistemare l'url
        this.popoverController.dismiss();
    }

    goToPersonnel() {
        this.router.navigate(['/personnel/dashboard']);
        this.popoverController.dismiss();
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
        this.popoverController.dismiss();
    }
}