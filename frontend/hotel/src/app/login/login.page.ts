import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonItem, IonButton, IonIcon } from '@ionic/angular/standalone';
import { LoginService } from './login.service';
import { Router, RouterLink } from '@angular/router'; 
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [ IonContent, CommonModule, FormsModule, IonInput, IonItem, IonButton, RouterLink]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit() {}

  login() {
    this.loginService.login(this.email, this.password).subscribe({
      next: (data) => {
        console.log('Login effettuato con successo.');
        console.log(data);
        Preferences.set({
          key: 'userData',
          value: JSON.stringify(data),
        });
        this.router.navigate(['/dashboard']); // Reindirizza alla dashboard dopo il login
      },
      error: (err: any) => {
        console.error('Errore durante il login: ', err);
        alert('Email o password errati. Riprova.');
      },
    });
  }

  logut() {
    // Rimuovi i dati utente da localStorage
    localStorage.removeItem('user');
    console.log("Logout effettuato con successo.");
    // Gestisci il logout, ad esempio reindirizza l'utente alla pagina di login
  }



}