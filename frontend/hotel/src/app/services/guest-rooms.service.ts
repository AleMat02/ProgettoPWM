import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { CheckAvailabilityData } from 'src/app/interfaces/guest-rooms.interface';

@Injectable({
  providedIn: 'root'
})
export class GuestRoomsService {
  apiUrl = `${environment.backendUrl}/api`;

  constructor(private http: HttpClient) { }

  getAviableRoomsByHotelId(checkAviabilityData: CheckAvailabilityData, hotel_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/hotels/${hotel_id}/available-rooms`, { params: { ...checkAviabilityData } });
  }

  getRoomAvailability(room_id: number, check_in: string, check_out: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/rooms/${room_id}/availability`, { params: { check_in, check_out } });
  }
}