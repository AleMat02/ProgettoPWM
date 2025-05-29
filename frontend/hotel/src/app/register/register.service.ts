import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export enum UserRole {
  ADMIN = "admin",
  RECEPTIONIST = "receptionist",
  GUEST = "guest"
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  apiUrl = "http://localhost:5000/api/register";
  
  constructor(private http: HttpClient) { }

  register(
    username: string,
    password: string,
    role: UserRole,
    full_name: string,
    phone: string,
    email: string
  ): Observable<any> {
    return this.http.post(this.apiUrl, { username, password, role, full_name, email, phone });
  }

}