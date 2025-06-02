import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BACKEND_URL } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AddRoomsService {
    apiUrl = `${BACKEND_URL}/api/add_rooms`;

    constructor(private http: HttpClient) { }

    addRoom(
        room_number: number,
        room_type: string, //bisogna capire il tipo, nell'esempio della collezione consiglia "double"
        capacity: number,
        price_per_night: number, //va aggiunta la currency visualmente
        hotel_id: number, //TODO: vanno prima creati, e poi magari selezionati tramite una select
        description?: string
    ): Observable<any> {
        return this.http.post(this.apiUrl, {room_number, room_type, capacity, price_per_night, hotel_id, description});
    }
}