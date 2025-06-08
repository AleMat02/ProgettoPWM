import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BACKEND_URL } from "src/environments/environment";
import { AddHotelData } from "../interfaces/add-hotel.interface";

@Injectable({
    providedIn: 'root'
})
export class AddHotelService {
    apiUrl = `${BACKEND_URL}/api/create_hotel`;

    constructor(private http: HttpClient) { }

    addHotel(addHotelData: AddHotelData
    ): Observable<any> {
        return this.http.post(this.apiUrl, {...addHotelData});
    }
}