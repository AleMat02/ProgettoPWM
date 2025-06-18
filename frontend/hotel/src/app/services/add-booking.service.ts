import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { AddBookingData} from '../interfaces/add-booking.interface';

@Injectable({
  providedIn: 'root'
})
export class AddBookingService {
  apiUrl = `${environment.backendUrl}/api/bookings`;

  constructor(private http: HttpClient) { }

  createBookingRequest(addBookingData: AddBookingData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { ...addBookingData });
  }
}