import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import { BookingsHistoryFormComponent } from "../../components/bookings-history-form/bookings-history-form.component";

@Component({
  selector: 'app-user-booking-history',
  templateUrl: './user-booking-history.page.html',
  styleUrls: ['./user-booking-history.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, BookingsHistoryFormComponent, IonContent]
})
export class UserBookingHistoryPage {
  constructor() { }
}