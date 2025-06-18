import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonItem, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router'; 
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {}

  ngOnInit() {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (data: any) => {
        this.toastService.presentSuccessToast(data.message);
        this.router.navigate(['']); // Reindirizza alla landing page dopo il login
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