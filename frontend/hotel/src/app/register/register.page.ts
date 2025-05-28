import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonButton, IonInput, IonSelect, IonSelectOption, IonList } from '@ionic/angular/standalone';
import { RegisterService } from './register.service';


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
export class RegisterPage implements OnInit {

  constructor(private registerService: RegisterService) { }

  ngOnInit() {
  }

  registerData = {
    username: '',
    password: '',
    email: "",
    phone: "",
    full_name: '',
    role: 'user' as 'admin' | 'user'
  }

  register() {
    this.registerService.register(this.registerData.email, this.registerData.password,this.registerData.role, this.registerData.full_name, this.registerData.phone, this.registerData.email).subscribe({
      next: (data) => {
        console.log("Registrazione effettuata con successo.");
        console.log(data);
  
      },
      error: (err: any) => {
        console.error("Errore durante la registrazione: ", err);
      }
    });
  }


}
