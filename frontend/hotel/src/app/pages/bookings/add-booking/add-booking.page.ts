import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonButton, IonItem, IonContent, IonInput, IonTitle, IonLabel, IonText } from '@ionic/angular/standalone';
import { ToastService } from "src/app/services/toast.service";
import { Router } from '@angular/router';
import * as Utils from "src/app/utils"
import { AddBookingData } from 'src/app/interfaces/add-booking.interface';
import { AddBookingService } from 'src/app/services/add-booking.service';

@Component({
    selector: 'app-add-booking',
    templateUrl: './add-booking.page.html',
    styleUrls: ['./add-booking.page.scss'],
    standalone: true,
    imports: [IonText, IonLabel, IonTitle, IonContent, IonItem, IonInput, IonButton, CommonModule, ReactiveFormsModule]
})
export class AddBookingPage {
    bookingForm: FormGroup = new FormGroup({}); // Inizializzazione vuota per evitare undefined
    today: string = new Date().toISOString().split('T')[0]; // Data odierna in formato yyyy-MM-dd

    //Form Builder permette un'implementazione più rapida della validazione rispetto al solo formGroup
    constructor(
        private fb: FormBuilder,
        private addBookingService: AddBookingService,
        private toastService: ToastService,
        private router: Router // aggiungi Router come dipendenza
    ) { }

    //Inseriamo più regole rispetto al backend per scelta personale
    ngOnInit(): void {
        this.bookingForm = this.fb.group(
            {
                room_id: [null, [Validators.required, Validators.min(0)]], // Campo obbligatorio, numerico
                check_in: ['', [Validators.required]], // Campo obbligatorio, data non nel passato
                check_out: ['', [Validators.required]]
            }
        );

        // Ogni volta che cambia check_in, controlla la validità rispetto a check_out
        this.bookingForm.get('check_in')?.valueChanges.subscribe(() => {
            this.resetCheckOutIfInvalid();
        });
    }

    // Funzione che resetta check_out se la data di check-in è superiore a quella di check-out
    resetCheckOutIfInvalid() {
        const checkInValue = this.bookingForm.get('check_in')?.value;
        const checkOutValue = this.bookingForm.get('check_out')?.value;
        if (checkInValue && checkOutValue) {
            const checkInDate = new Date(checkInValue);
            const checkOutDate = new Date(checkOutValue);
            if (checkInDate > checkOutDate) {
                this.bookingForm.get('check_out')?.setValue('');
            }
        }
    }


    onSubmit() {
        if (this.bookingForm.invalid) {
            this.bookingForm.markAllAsTouched()
            this.toastService.presentErrorToast('Per favore, compila tutti i campi in maniera corretta.');
            return;
        }

        const bookingFormData: AddBookingData = this.bookingForm.value;
        console.log("Dati per la creazione della prenotazione inviati:", bookingFormData)

        this.addBookingService.createBookingRequest(bookingFormData).subscribe({
            next: (res: any) => {
                this.toastService.presentSuccessToast(`Prenotazione per stanza ${bookingFormData.room_id} aggiunta con successo!`);
                this.bookingForm.reset({
                    room_id: '',
                    check_in: '',
                    check_out: '',
                });
                this.router.navigate(['/bookings']); // Reindirizza alla pagina delle prenotazioni
            },
            error: (err: any) => {
                this.toastService.handleErrorToast(err)
            }
        })
    }

    isFormFieldInvalid(field: string) {
        return Utils.isFormFieldInvalid(this.bookingForm, field)
    }

    getFormErrorMessage(field: string) {
        return Utils.getFormErrorMessage(this.bookingForm, field)
    }
}