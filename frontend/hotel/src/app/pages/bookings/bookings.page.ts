import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonItem
} from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';



@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonButton, IonItem, RouterLink, RouterLinkActive]
})
export class BookingsPage implements OnInit {
  role: string = '';
  isGuest: boolean = false; // Inizialmente impostato a true, cambia in base al ruolo

  ngOnInit() {
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
  constructor() {}


}
