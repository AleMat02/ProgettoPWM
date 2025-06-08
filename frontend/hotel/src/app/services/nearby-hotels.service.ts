import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class NearbyHotelsService {
  apiUrl = "http://localhost:5000/api";
  constructor(private http: HttpClient) { }

  latitude: number | null = null;
  longitude: number | null = null;
  radius: number = 5; // Raggio di ricerca in metri

  async getCurrentPosition() : Promise<any> {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log('Posizione:', position);
      return position;
    } catch (error) {
      console.error('Errore nella geolocalizzazione:', error);
      throw error;
    }
  }

  getNearbyHotels(): Observable<any> {
    return this.http.get(`${this.apiUrl}/hotels/nearby?lat=${this.latitude}&lng=${this.longitude}&radius=${this.radius}`);
  }
}