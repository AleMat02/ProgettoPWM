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
                name: ['', [Validators.minLength(4), Validators.maxLength(30)]], //I campi sono tutti opzionali, ma se l'utente digita qualcosa, allora l'input deve rispettare la lunghezza qui specificata
                address: ['', [Validators.minLength(6), Validators.maxLength(40)]],
                city: ['', [Validators.minLength(4), Validators.maxLength(30)]],
                latitude: ['', Validators.maxLength(15)], //Il fatto che alcuni campi debbano essere solo numeri viene controllato dall'ion-input nell'html tramite la proprietà "type" 
                longitude: ['', Validators.maxLength(15)],
                description: ['', Validators.maxLength(100)], //il campo deve contenere solo numeri, ed avere una lunghezza di 10 numeri
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
        console.log("Dati per la creazione dell'utente inviati:", hotelFormData)

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
                this.toastService.handleErrorToast(err)
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