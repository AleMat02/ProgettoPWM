import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonInput, IonItem, IonButton, IonIcon, IonLabel, IonText, IonCard, IonCardContent, IonTitle } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import * as Utils from 'src/app/utils';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonTitle, IonText, IonLabel, IonContent, FormsModule, IonInput, IonItem, IonButton, RouterLink, ReactiveFormsModule, IonCard, IonCardContent]
})

export class LoginPage implements OnInit {
  userForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService, private fb: FormBuilder,) { }

  ngOnInit() {
    this.userForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
      }
    );
  }

  onSubmit() {
    const { username, password } = this.userForm.value;
    this.authService.login(username, password).subscribe({
      next: (data: any) => {
        this.toastService.presentSuccessToast(data.message);
        this.router.navigate(['']); // Reindirizza alla landing page dopo il login
        this.userForm.reset();
      },
      error: (err: any) => {
        this.toastService.presentErrorToast("Errore durante l'accesso");
        console.error("Errore durante l'accesso: ", err)
      },
    });
  }

  isFormFieldInvalid(field: string) {
    return Utils.isFormFieldInvalid(this.userForm, field)
  }

  getFormErrorMessage(field: string) {
    return Utils.getFormErrorMessage(this.userForm, field)
  }
}