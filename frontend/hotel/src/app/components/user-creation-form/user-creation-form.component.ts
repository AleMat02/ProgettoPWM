import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { IonItem, IonButton, IonInput, IonSelect, IonSelectOption, IonLabel, IonTitle, IonText } from '@ionic/angular/standalone';
import { UserCreationFormData, UserRole } from 'src/app/shared/interfaces/auth.interface';

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
    CommonModule,
    ReactiveFormsModule
    //* Poi dobbiamo spiegare perché abbiamo utilizzato Reactiveforms al posto dei template-driven forms
  ]
})
export class UserCreationFormComponent implements OnInit {
  @Input() formTitleText: string = "Crea un nuovo account"
  @Input() showRoleSelection: boolean = false;
  @Input() submitButtonText: string = "Registrati"

  @Output() formSubmit = new EventEmitter<UserCreationFormData>();

  userForm!: FormGroup;

  roles = Object.values(UserRole)

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

  constructor(private fb: FormBuilder) { } //Form Builder permette un'implementazione più rapida della validazione rispetto al solo formGroup

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
        role: [UserRole.Guest, Validators.required]
      },
      {
        validators: this.matchPasswords('password', 'confirmPassword')
      }
    );
  }

  onSubmit() {
    if (this.userForm.invalid) { //il pulsante di submit diventa disabled se gli input non sono stati tutti inseriti, questa è un'ulteriore guard
      this.userForm.markAllAsTouched()
      return;
    }
    console.log("Dati per la creazione dell'utente inviati ")
    const { confirmPassword, ...userFormData } = this.userForm.value;

    this.formSubmit.emit(userFormData as UserCreationFormData)
  }

  isFieldInvalid(field: string): boolean {
    const control = this.userForm.get(field);
    if (!control) { return false; }

    // Considera il campo non valido se il controllo stesso è non valido E toccato/sporco
    let isInvalid = control.invalid && (control.dirty || control.touched);

    // Caso speciale per 'confirmPassword': consideralo non valido anche se c'è un errore di 'passwordMismatch'
    // a livello di form e almeno uno dei campi password è stato toccato.
    if (field === 'confirmPassword') {
      const passwordControl = this.userForm.get('password');
      if (this.userForm.hasError('passwordMismatch') && (control.touched || passwordControl?.touched)) {
        return true; // Sovrascrive isInvalid se c'è un mismatch e i campi rilevanti sono stati toccati
      }
    }
    return isInvalid;
  }

  getErrorMessage(field: string): string | null {
    const control = this.userForm.get(field);
    if (!control) return null;

    if (field === 'confirmPassword' && this.userForm.hasError('passwordMismatch')) {
      const passwordControl = this.userForm.get('password');
      // Mostra l'errore di mismatch solo se 'confirmPassword' o 'password' sono stati toccati
      if (control.touched || passwordControl?.touched) {
        return 'Le password non coincidono.';
      }
    }

    if (control.errors) {
      if (control.errors['required']) return 'Questo campo è obbligatorio.';
      if (control.errors['email']) return "Inserisci un'email valida.";
      if (control.errors['minlength']) return `E' necessario inserire almeno ${control.errors['minlength'].requiredLength} caratteri.`;
      if (control.errors['pattern']) return 'Formato non valido.';
    }
    return null;
  }

}