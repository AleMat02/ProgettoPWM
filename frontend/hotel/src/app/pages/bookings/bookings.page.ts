import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonItem
} from '@ionic/angular/standalone';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserRole } from 'src/app/interfaces/user.interface';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonItem, RouterLink, RouterLinkActive]
})
export class BookingsPage implements OnInit, OnDestroy {
  isGuest: boolean = true; // Inizialmente impostato a true, cambia in base al ruolo
  userSub!: Subscription

  PendingReservations: any[] = []; // Array per memorizzare le prenotazioni

  constructor(private authService: AuthService, private toastService: ToastService) { }

  ngOnInit() {
    this.userSub = this.authService.user$.subscribe(user => {
      if(user) {
        this.isGuest = user.role === UserRole.Guest
      } else {
        this.toastService.presentErrorToast("C'è stato un errore nel recupero dell'utente.")
      }
    })
    //chiamata al servizio per ottenere le prenotazioni 
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}