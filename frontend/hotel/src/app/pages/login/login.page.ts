import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonItem, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router'; 
import { Preferences } from '@capacitor/preferences';
import { LoginService } from 'src/app/services/login.service';
import { ToastService } from 'src/app/services/toast.service';

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

  constructor(private loginService: LoginService, private router: Router, private toastService: ToastService) {}

  ngOnInit() {}

  login() {
    this.loginService.login(this.email, this.password).subscribe({
      next: (data) => {
        this.toastService.presentSuccessToast(`Accesso effettuato con successo!`);
        console.log("Dati ricevuti:", data);
        Preferences.set({
          key: 'userData',
          value: JSON.stringify(data),
        });
        this.router.navigate(['/dashboard']); // Reindirizza alla dashboard dopo il login
      },
      error: (err: any) => {
        this.toastService.handleErrorToast(err)
      },
    });
  }

  logut() {
    localStorage.removeItem('user');
    console.log("Logout effettuato con successo.");
    this.router.navigate(['/dashboard']);
  }
}