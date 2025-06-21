import { Component } from '@angular/core';
import { BookingsHistoryFormComponent } from 'src/app/components/bookings-history-form/bookings-history-form.component';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings-history.page.html',
  styleUrls: ['./bookings-history.page.scss'],
  imports:[BookingsHistoryFormComponent]
})
export class BookingsHistoryPage {
  constructor(){};

}