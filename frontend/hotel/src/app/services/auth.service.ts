import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';
import { UserData, UserRole } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
    registerApiUrl = `${environment.backendUrl}/api/register`; //viene utilizzato sia da register che da add-users
    loginApiUrl = `${environment.backendUrl}/api/login`;

    private userSubject = new BehaviorSubject<UserData | null>(null)
    public user$ = this.userSubject.asObservable()

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

    login(username: string, password: string): Observable<any> {
        return this.http.post(this.loginApiUrl, { username, password }).pipe(tap(
            async (res: any) => {
                const user = res.data;

                await Preferences.set({
                    key: 'userData',
                    value: JSON.stringify(user),
                });

                this.userSubject.next(user)
            } //L'errore è gestito nella pagina di login
        ));
    }

    async logout() {
        await Preferences.remove({ key: 'authData' }); //dalla navbar(?) deve reindirizzare alla pagina di login
        this.userSubject.next(null);
    }

    async loadUser() { //L'utente viene gestito all'apertura del sito se vi è una entry relativa nelle preferences
        const user = await Preferences.get({key: 'userData'})
        if(user.value) this.userSubject.next(JSON.parse(user.value))
    }

}