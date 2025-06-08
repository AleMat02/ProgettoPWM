import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BACKEND_URL } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class RoomsService {
    apiUrl = `${BACKEND_URL}/api/get_rooms`;

    constructor(private http: HttpClient) { }

    getRooms(): Observable<any> {
        return this.http.get(this.apiUrl);
    }
}