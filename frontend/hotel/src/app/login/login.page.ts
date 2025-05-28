import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonItem, IonButton} from '@ionic/angular/standalone';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonInput, IonItem, IonButton ]
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  login() {
    this.loginService.login(this.email, this.password).subscribe({
      next: (data) => {
        console.log("Login effettuato con successo.");
        // Salva il token o un flag di login
        localStorage.setItem('token', data.token); // Assicurati che il backend restituisca un token
        // Gestisci il successo del login, ad esempio reindirizza l'utente a un'altra pagina
      },
      error: (err: any) => {
        console.error("Errore durante il login: ", err);
      }
    });
  }


}

