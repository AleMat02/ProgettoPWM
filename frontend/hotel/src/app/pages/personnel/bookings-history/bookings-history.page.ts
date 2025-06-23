import { Component } from '@angular/core';
import { BookingsHistoryFormComponent } from 'src/app/components/bookings-history-form/bookings-history-form.component';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings-history.page.html',
  styleUrls: ['./bookings-history.page.scss'],
  imports: [BookingsHistoryFormComponent, IonContent]
})
export class BookingsHistoryPage {
  constructor(){};

}