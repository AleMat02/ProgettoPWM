import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonButton, IonInput, IonSelect, IonSelectOption, IonList } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserCreationFormData, UserRole } from 'src/app/shared/interfaces/auth.interface';
import { UserCreationFormComponent } from 'src/app/components/user-creation-form/user-creation-form.component';

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

  constructor(private authService: AuthService) { }

  createUser(userData: UserCreationFormData) {
    this.authService.register(userData.username, userData.password, userData.role, userData.full_name, userData.phone, userData.email).subscribe({
      next: (res: any) => { //Forse al posto di any si può mettere Response?
        console.log(res.message); //!questo sarà un alert, si svuoterà il form
      },
      error: (err: any) => { //Forse al posto di any si può mettere Error?
        console.error("Errore durante la registrazione: ", err); //!questo sarà un alert, e così non si svuota il form
      }
    });
  }

}
