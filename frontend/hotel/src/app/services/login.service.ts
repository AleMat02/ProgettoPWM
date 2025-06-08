import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BACKEND_URL } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl = `${BACKEND_URL}/api/login`;
  
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, password });
  }
}
