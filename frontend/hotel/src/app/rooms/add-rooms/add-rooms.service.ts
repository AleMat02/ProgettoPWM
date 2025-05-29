import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AddRoomsService {
    apiUrl = "http://localhost:5000/api/add_rooms";

    constructor(private http: HttpClient) { }

    addRoom(
        room_number: number,
        room_type: string, //bisogna capire il tipo, nell'esempio della collezione consiglia "double"
        capacity: number,
        price_per_night: number, //va aggiunta la currency visualmente
        hotel_id: number, //vanno prima creati
        description?: string
    ): Observable<any> {
        return this.http.post(this.apiUrl, {room_number, room_type, capacity, price_per_night, hotel_id, description});
    }
}