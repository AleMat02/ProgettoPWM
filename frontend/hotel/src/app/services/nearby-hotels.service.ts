import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NearbyHotelsService {
  apiUrl = `${environment.backendUrl}/api/hotels/nearby`;
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
    return this.http.get(`${this.apiUrl}?lat=${this.latitude}&lng=${this.longitude}&radius=${this.radius}`);
  }
}