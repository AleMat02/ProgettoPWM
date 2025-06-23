import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class RoomsService {
    getRoomsUrl = `${environment.backendUrl}/api/get_rooms`;
    deleteRoomUrl = `${environment.backendUrl}/api/rooms`;

    constructor(private http: HttpClient) { }

    getRooms(): Observable<any> {
        return this.http.get(this.getRoomsUrl);
    }

    deleteRoom(id: number): Observable<any> {
        return this.http.delete(`${this.deleteRoomUrl}/${id}`);
    }
}