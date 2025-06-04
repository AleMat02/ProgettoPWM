import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BACKEND_URL } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AddRoomsService {
    apiUrl = `${BACKEND_URL}/api/create_hotel`;

    constructor(private http: HttpClient) { }

    addHotel(
        name?: string,
        address?: string,
        city?: string,
        latitude?: number,
        longitude?: number,
        description?: string
    ): Observable<any> {
        return this.http.post(this.apiUrl, {name, address, city, latitude, longitude, description});
    }
}