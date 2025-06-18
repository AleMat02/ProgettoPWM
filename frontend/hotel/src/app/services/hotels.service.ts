import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class HotelsService {
    getHotelsUrl = `${environment.backendUrl}/api/get_hotels`;
    deleteHotelUrl = `${environment.backendUrl}/api/remove_hotel`;

    constructor(private http: HttpClient) { }

    getHotels(): Observable<any> {
        return this.http.get(this.getHotelsUrl);
    }

    deleteHotel(id: string): Observable<any> {
        return this.http.delete(`${this.deleteHotelUrl}/${id}`);
    }
}