import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { UserCreationFormData } from 'src/app/interfaces/user-creation-form.interface';
import { UserCreationFormComponent } from 'src/app/components/user-creation-form/user-creation-form.component';
import { RegisterService } from 'src/app/services/register.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    UserCreationFormComponent
  ]
})
export class AddUserPage {

  @ViewChild(UserCreationFormComponent) private userCreationForm!: UserCreationFormComponent

  constructor(private registerService: RegisterService, private toastService: ToastService) { }

  createUser(userData: UserCreationFormData) {
    this.registerService.register(userData.username, userData.password, userData.role, userData.full_name, userData.phone, userData.email).subscribe({
      next: (res: any) => {
        this.toastService.presentSuccessToast(`Utente ${userData.username} aggiunto con successo!`);

        this.userCreationForm.resetForm()
      },
      error: (err: any) => {
        const errorMessage = err?.error?.message || 'Si è verificato un errore.';
        this.toastService.presentErrorToast(errorMessage);
      }
    });
  }

}
