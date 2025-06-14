import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { UserCreationFormComponent } from 'src/app/components/user-creation-form/user-creation-form.component';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserData } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    UserCreationFormComponent
  ]
})
export class RegisterPage {

  @ViewChild(UserCreationFormComponent) private userCreationForm!: UserCreationFormComponent

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) { }

  registerUser(userData: UserData) {
    this.authService.register(userData.username, userData.password, userData.role, userData.full_name, userData.phone, userData.email).subscribe({
      next: (res: any) => {
        this.toastService.presentSuccessToast(`Registrazione avvenuta con successo!`);
        this.router.navigate(['/login'])
      },
      error: (err: any) => {
        this.toastService.handleErrorToast(err)
      }
    });
  }

}
