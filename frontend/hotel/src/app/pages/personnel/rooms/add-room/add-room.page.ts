import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonItem, IonSelect, IonSelectOption, IonContent, IonInput, IonText, IonTitle, IonLabel } from '@ionic/angular/standalone';
import { AddRoomData } from 'src/app/interfaces/add-room.interface';
import * as Utils from 'src/app/utils'
import { ToastService } from 'src/app/services/toast.service';
import { RoomType, ROOM_CAPACITIES } from 'src/app/interfaces/room.interface';
import { AddRoomService } from 'src/app/services/add-room.service';

@Component({
    selector: 'app-add-room',
    templateUrl: './add-room.page.html',
    styleUrls: ['./add-room.page.scss'],
    imports: [IonLabel, IonTitle, IonText, IonContent, IonItem, IonInput, IonButton, IonSelect, IonSelectOption, CommonModule, ReactiveFormsModule]
})
export class AddRoomPage implements OnInit {
    roomForm!: FormGroup;

    roomTypes = Object.values(RoomType) //Mettendo keys sarebbe stato indifferente in quanto avremmo comunque tenuto la pipe "Titlecase" per scelta nell'html

    constructor(private fb: FormBuilder, private addRoomService: AddRoomService, private toastService: ToastService) { }

    //Inseriamo più regole rispetto al backend per scelta personale
    ngOnInit(): void {
        this.roomForm = this.fb.group(
            {
                room_number: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{0,2}$/)]], //Es. 1-999, non inizia con 0
                room_type: [RoomType.Single, [Validators.required]],
                capacity: [{ value: ROOM_CAPACITIES[RoomType.Single], disabled: true }, [Validators.required, Validators.max(4)]],
                price_per_night: ['', [Validators.required, Validators.maxLength(4)]],
                hotel_id: ['', [Validators.required, Validators.max(20)]],
                description: ['', [Validators.maxLength(100)]]
            }
        );

        this.roomForm.get('room_type')?.valueChanges.subscribe((selectedRoomType: RoomType) => {
            const formCapacity = this.roomForm.get('capacity');
            if (selectedRoomType && formCapacity) { //selectedRoomType potrebbe essere null se il campo è resettato
                const newCapacity = ROOM_CAPACITIES[selectedRoomType];
                formCapacity.setValue(newCapacity);
            }
        });
    }

    onSubmit() {
        if (this.roomForm.invalid) { //il pulsante di submit diventa disabled se gli input non sono stati tutti inseriti correttamente, questa è un'ulteriore guard
            this.roomForm.markAllAsTouched()
            this.toastService.presentErrorToast('Per favore, compila tutti i campi obbligatori in maniera corretta.');
            return;
        }

        const addRoomData: AddRoomData = this.roomForm.getRawValue() //includo anche i valori dei campi disabilitati (capacity)

        this.addRoomService.addRoom(addRoomData.room_number, addRoomData.room_type, addRoomData.capacity, addRoomData.price_per_night, addRoomData.hotel_id, addRoomData.description).subscribe({
            next: (res: any) => {
                this.toastService.presentSuccessToast(`Stanza ${addRoomData.room_number} aggiunta con successo!`);

                //Resetta il form dopo il successo
                this.roomForm.reset({
                    room_number: '',
                    room_type: RoomType.Single,
                    capacity: ROOM_CAPACITIES[RoomType.Single], //Nonostante cambi in base a room_type, ho bisogno di aggiungere anche qui il valore, non lo aggiorna automaticamente in questo caso
                    price_per_night: '',
                    hotel_id: '',
                    description: ''
                });
            },
            error: (err: any) => {
                this.toastService.presentErrorToast("Errore nella creazione della stanza")
                console.error("Errore nella creazione della stanza: ", err)
            }
        })
    }

    isFormFieldInvalid(field: string) {
        return Utils.isFormFieldInvalid(this.roomForm, field)
    }

    getFormErrorMessage(field: string) {
        return Utils.getFormErrorMessage(this.roomForm, field)
    }
}