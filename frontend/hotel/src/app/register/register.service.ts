import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  apiUrl = "http://localhost:5000/api/register"; // Cambia se il backend è su un altro host/porta
  constructor(private http: HttpClient) { }





  
  register(
    username: string,
    password: string,
    role: "admin" | "user",
    full_name: string,
    phone: string,
    email: string
  ): Observable<any> {
    return this.http.post(this.apiUrl, { username, password, role, full_name, email, phone });
  }

}