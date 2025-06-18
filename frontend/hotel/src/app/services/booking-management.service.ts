import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { SearchData } from 'src/app/interfaces/booking-management.interface';


@Injectable({
  providedIn: 'root'
})

export class BookingManagementService {
  
  apiUrl = `${environment.backendUrl}/api/bookings`;

  constructor(private http: HttpClient) { }

  getPendingBookings(searchData: SearchData ): Observable<any> {
    return this.http.get(`${this.apiUrl}/pending`, { params: {...searchData} });
  }


  manageBookingRequest(bookingId: number, decision: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${bookingId}/process`, {"action": decision});
  }


}