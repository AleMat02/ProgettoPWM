import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { UserCreationFormComponent } from 'src/app/components/user-creation-form/user-creation-form.component';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserData } from 'src/app/interfaces/user.interface';

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

  constructor(private authService: AuthService, private toastService: ToastService) { }

  createUser(userData: UserData) {
    this.authService.register(userData.username, userData.password, userData.role, userData.full_name, userData.phone, userData.email, userData.hotel_id).subscribe({
      next: (res: any) => {
        this.toastService.presentSuccessToast(`Utente "${userData.username}" aggiunto con successo!`);

        this.userCreationForm.resetForm()
      },
      error: (err: any) => {
        this.toastService.presentErrorToast("Errore nella creazione dell'utente");
        console.error("Errore nella creazione dell'utente: ", err)
      }
    });
  }

}
