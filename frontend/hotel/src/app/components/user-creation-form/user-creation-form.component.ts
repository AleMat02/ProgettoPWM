import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { IonItem, IonButton, IonInput, IonSelect, IonSelectOption, IonLabel, IonTitle, IonText, IonCard, IonCardContent } from '@ionic/angular/standalone';
import * as Utils from 'src/app/utils';
import { ToastService } from 'src/app/services/toast.service';
import { UserData, UserRole } from 'src/app/interfaces/user.interface';
import { HotelsService } from 'src/app/services/hotels.service';
import { HotelData } from 'src/app/interfaces/hotel.interface';

@Component({
  selector: 'app-user-creation-form',
  templateUrl: './user-creation-form.component.html',
  styleUrls: ['./user-creation-form.component.scss'],
  standalone: true,
  imports: [
    IonText,
    IonTitle,
    IonLabel,
    IonInput,
    IonItem,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardContent,
    CommonModule,
    ReactiveFormsModule // Abbiamo deciso di utilizzare i Reactive Forms al posto dei Template-Driven Forms in quanto ci permettono un controllo programmatico maggiore non dipendente dall'HTML, come per esempio per l'implementazione della validazione
  ]
})
export class UserCreationFormComponent implements OnInit {
  @Input() formTitleText: string = "Crea un nuovo account"
  @Input() showRoleSelection: boolean = false;
  @Input() submitButtonText: string = "Registrati"

  @Output() formSubmit = new EventEmitter<UserData>();

  userForm!: FormGroup;
  hotels: HotelData[] = [];
  roles = Object.values(UserRole) //Mettendo keys sarebbe stato indifferente in quanto avremmo comunque tenuto la pipe "Titlecase" per scelta nell'html

  matchPasswords(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const password = group.get(passwordKey);
      const confirmPassword = group.get(confirmPasswordKey);

      if (!password || !confirmPassword) {
        return null;
      }
      if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
        // Non sovrascrivere altri errori di confirmPassword (es. 'required')
        return null;
      }
      return password.value === confirmPassword.value ? null : { passwordMismatch: true };
    };
  }

  hotelIdRequiredIfReception(): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.parent) return null;
      const role = control.parent.get('role')?.value;
      if (role === UserRole.Reception && !control.value) {
        return { required: true };
      }
      return null;
    };
  }

  //Form Builder permette un'implementazione più rapida della validazione rispetto al solo formGroup
  constructor(private fb: FormBuilder, private toastService: ToastService, private hotelService: HotelsService) { }

  //Anche se nel backend full_name, phone e role non sono obbligatori, qui lo sono per una migliore identificazione e gestione del cliente.
  //Inseriamo più regole rispetto al backend per scelta personale
  ngOnInit(): void {
    this.userForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        full_name: ['', [Validators.required, Validators.minLength(3)]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]], //il campo deve contenere solo numeri, ed avere una lunghezza di 10 numeri
        role: [UserRole.Guest, [Validators.required]],
        hotel_id: [null, this.hotelIdRequiredIfReception()]
      },
      {
        validators: this.matchPasswords('password', 'confirmPassword')
      }
    );

    this.userForm.get('role')?.valueChanges.subscribe(() => {
      this.userForm.get('hotel_id')?.updateValueAndValidity();
    });

    this.hotelService.getHotels().subscribe({
      next: (res: any) => {
        this.hotels = res.data.hotels;
      },
      error: (err : any) => {
        this.toastService.presentErrorToast("Errore nel recupero degli hotel");
        console.error("Errore nel recupero degli hotel: ", err);
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) { //il pulsante di submit diventa disabled se gli input non sono stati tutti inseriti correttamente, questa è un'ulteriore guard
      this.userForm.markAllAsTouched()
      this.toastService.presentErrorToast('Per favore, compila tutti i campi obbligatori in maniera corretta.');
      return;
    }

    const { confirmPassword, ...userFormData } = this.userForm.value;

    this.formSubmit.emit(userFormData as UserData)
  }

  isFormFieldInvalid(field: string) {
    return Utils.isFormFieldInvalid(this.userForm, field)
  }

  getFormErrorMessage(field: string) {
    return Utils.getFormErrorMessage(this.userForm, field)
  }

  resetForm(): void {
    this.userForm.reset({
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      full_name: '',
      phone: '',
      role: this.showRoleSelection ? UserRole.Guest : null
    });
  }
}