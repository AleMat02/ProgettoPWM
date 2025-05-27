import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RoomsService {
    apiUrl = "http://localhost:5000/api/get_rooms";

    constructor(private http: HttpClient) { }

    getRooms(): Observable<any> {
        return this.http.get(this.apiUrl);
    }
}