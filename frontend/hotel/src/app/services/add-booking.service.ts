import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { BACKEND_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreateBookingRequestService {
  apiUrl = `${BACKEND_URL}/api/booking`;

  constructor(private http: HttpClient) { }

  createBookingRequest(room_id: number, check_in_date: string, check_out_date: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { room_id, check_in_date, check_out_date });
  }
}