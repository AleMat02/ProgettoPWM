import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonButton, IonInput, IonSelect, IonSelectOption, IonList } from '@ionic/angular/standalone';
import { RegisterService, UserRole } from './register.service';

interface RegisterData {
  username: string,
  password: string,
  email: string,
  phone: string,
  full_name: string, //* Non è in camelCase altrimenti non va bene per il back
  role: UserRole
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonItem,
    IonContent,
    IonButton,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule
  ]
})
export class RegisterPage {

  constructor(private registerService: RegisterService) { }

  registerData: RegisterData = {
    username: '',
    password: '',
    email: "",
    phone: "",
    full_name: '',
    role: UserRole.Guest //Di default, i nuovi utenti creati sono guests
  }

  register() {
    this.registerService.register(this.registerData.username, this.registerData.password, this.registerData.role, this.registerData.full_name, this.registerData.phone, this.registerData.email).subscribe({
      next: (res: any) => {
        console.log(res.message); //TODO: Questo console.log deve diventare un alert, ed anche quello in err
        //TODO: reindirizza l'utente a un'altra pagina
      },
      error: (err: any) => { //Forse al posto di any si può mettere Error?
        console.error("Errore durante la registrazione: ", err);
      }
    });
  }

}
