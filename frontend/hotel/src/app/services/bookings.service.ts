import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { AddBookingData} from '../interfaces/add-booking.interface';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  apiUrl = `${environment.backendUrl}/api`;

  constructor(private http: HttpClient) { }

  createBookingRequest(addBookingData: AddBookingData): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, { ...addBookingData });
  }

  getBookings(user_id: number){
    return this.http.get(`${this.apiUrl}/users/bookings`, { params: { user_id: user_id} });
  }

}