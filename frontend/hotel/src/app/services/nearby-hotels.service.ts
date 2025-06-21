import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { PositionData } from '../interfaces/nearby-hotels.interface';

@Injectable({
  providedIn: 'root'
})

export class NearbyHotelsService {
  apiUrl = `${environment.backendUrl}/api/hotels/nearby`;
  constructor(private http: HttpClient) { }

  
  getNearbyHotels(positionData: PositionData): Observable<any> {
    return this.http.get(`${this.apiUrl}?lat=${positionData.lat}&lng=${positionData.lng}&radius=${positionData.radius}`);
  }
}