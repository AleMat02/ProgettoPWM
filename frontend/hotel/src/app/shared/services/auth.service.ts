import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BACKEND_URL } from 'src/environments/environment';
import { UserRole } from '../interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  registerApiUrl = `${BACKEND_URL}/api/register`; //viene utilizzato sia da register che da add-users

  constructor(private http: HttpClient) { }

  register(
    username: string,
    password: string,
    role: UserRole,
    full_name: string,
    phone: string,
    email: string
  ): Observable<any> {
    return this.http.post(this.registerApiUrl, { username, password, role, full_name, email, phone });
  }

}