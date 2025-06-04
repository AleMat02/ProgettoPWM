import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BACKEND_URL } from 'src/environments/environment';
import { UserRole } from 'src/app/interfaces/user-creation-form.interface';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  registerApiUrl = `${BACKEND_URL}/api/register`; //viene utilizzato sia da register che da add-users

  constructor(private http: HttpClient) { }

  register(
    username: string,
    password: string,
    role: UserRole,
    full_name: string,
    phone: string, //nel db è un campo string
    email: string
  ): Observable<any> {
    return this.http.post(this.registerApiUrl, { username, password, role, full_name, email, phone });
  }

}