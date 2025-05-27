import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'http://localhost:5000/api'; // Cambia se il backend è su un altro host/porta

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  // Metodo per ottenere le prenotazioni dell'utente
  getUserBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/bookings`);
  }

  // Altri metodi per chiamare il backend...
}
