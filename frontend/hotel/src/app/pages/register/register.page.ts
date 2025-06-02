import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserCreationFormData, UserRole } from '../../shared/interfaces/auth.interface';
import { UserCreationFormComponent } from 'src/app/components/user-creation-form/user-creation-form.component';

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

  constructor(private authService: AuthService) { }

  registerUser(userData: UserCreationFormData) {
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
