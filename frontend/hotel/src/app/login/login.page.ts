import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonItem, IonButton, IonIcon } from '@ionic/angular/standalone';
import { LoginService } from './login.service';
import { Router, RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [ IonContent, CommonModule, FormsModule, IonInput, IonItem, IonButton, RouterLink]
})
export class LoginPage implements OnInit { //Bisogna aggiungere le interfacce per le (altre) varie cose

  email: string = '';
  password: string = '';

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  login() {
    this.loginService.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log("Login effettuato con successo.");
        console.log(res);
        // Salva i dati utente in localStorage
        localStorage.setItem('user', JSON.stringify(res));
        
        //viasua per verificare che i dati siano stati salvati correttamente
        console.log(localStorage.getItem('user'));
      },
      error: (err: any) => {
        console.error("Errore durante il login: ", err);
      }
    });
  }


  logut() {
    // Rimuovi i dati utente da localStorage
    localStorage.removeItem('user');
    console.log("Logout effettuato con successo.");
    // Gestisci il logout, ad esempio reindirizza l'utente alla pagina di login
  }




}

