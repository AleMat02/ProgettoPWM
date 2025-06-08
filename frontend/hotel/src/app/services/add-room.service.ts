import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BACKEND_URL } from "src/environments/environment";
import { RoomType } from "../interfaces/room.interface";

@Injectable({
    providedIn: 'root'
})
export class AddRoomService {
    apiUrl = `${BACKEND_URL}/api/add_rooms`;

    constructor(private http: HttpClient) { }

    addRoom(
        room_number: number,
        room_type: RoomType,
        capacity: number,
        price_per_night: number,
        hotel_id: number, //Gli hotel ovviamente devono già esistere, ma purtroppo non è possibile utilizzare una select perché nel back-end manca la funzione per ottenere tutti quelli esistenti
        description?: string
    ): Observable<any> {
        return this.http.post(this.apiUrl, {room_number, room_type, capacity, price_per_night, hotel_id, description});
    }
}