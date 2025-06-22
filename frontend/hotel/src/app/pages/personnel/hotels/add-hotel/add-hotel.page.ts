import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonButton, IonItem, IonContent, IonInput, IonTitle, IonLabel, IonText } from '@ionic/angular/standalone';
import { AddHotelData } from "src/app/interfaces/add-hotel.interface";
import { AddHotelService } from "src/app/services/add-hotel.service";
import { ToastService } from "src/app/services/toast.service";
import * as Utils from "src/app/utils"

@Component({
    selector: 'app-add-hotel',
    templateUrl: './add-hotel.page.html',
    styleUrls: ['./add-hotel.page.scss'],
    imports: [IonText, IonLabel, IonTitle, IonContent, IonItem, IonInput, IonButton, CommonModule, ReactiveFormsModule]
})
export class AddHotelPage {
    hotelForm!: FormGroup;

    //Form Builder permette un'implementazione più rapida della validazione rispetto al solo formGroup
    constructor(private fb: FormBuilder, private addHotelService: AddHotelService, private toastService: ToastService) { }

    //Inseriamo più regole rispetto al backend per scelta personale
    ngOnInit(): void {
        this.hotelForm = this.fb.group(
            {
                name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
                address: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
                city: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
                latitude: ['',[Validators.required,Validators.maxLength(15)]],
                longitude: ['', [Validators.required, Validators.maxLength(15)]],
                description: ['', [Validators.maxLength(100)]],
            }
        );
    }

    onSubmit() {
        if (this.hotelForm.invalid) { //il pulsante di submit diventa disabled se gli input non sono stati tutti inseriti correttamente, questa è un'ulteriore guard
            this.hotelForm.markAllAsTouched()
            this.toastService.presentErrorToast('Per favore, compila tutti i campi in maniera corretta.');
            return;
        }

        const hotelFormData: AddHotelData = this.hotelForm.value;

        this.addHotelService.addHotel(hotelFormData).subscribe({
            next: (res: any) => {
                this.toastService.presentSuccessToast(`Hotel ${hotelFormData.name} aggiunto con successo!`); //Avremmo anche potuto prendere il messaggio dalla response ma preferiamo personalizzarlo

                // Resetta il form dopo il successo
                this.hotelForm.reset({
                    name: '',
                    address: '',
                    city: '', //Nonostante cambi in base a room_type, ho bisogno di aggiungere anche qui il valore, non lo aggiorna automaticamente in questo caso
                    latitude: '',
                    longitude: '',
                    description: ''
                });
            },
            error: (err: any) => {
                this.toastService.presentErrorToast("Errore nella creazione dell'hotel")
                console.error("Errore nella creazione dell'hotel: ", err)
            }
        })
    }

    isFormFieldInvalid(field: string) {
        return Utils.isFormFieldInvalid(this.hotelForm, field)
    }

    getFormErrorMessage(field: string) {
        return Utils.getFormErrorMessage(this.hotelForm, field)
    }
}