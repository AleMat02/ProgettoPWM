import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonItem, IonSelect, IonSelectOption, IonContent, IonInput, IonText, IonTitle, IonLabel } from '@ionic/angular/standalone';
import { AddRoomService } from '../../../services/add-room.service';
import { AddRoomData, RoomType } from 'src/app/interfaces/add-rooms.interface';
import * as Utils from 'src/app/utils'

@Component({
    selector: 'app-add-room',
    templateUrl: './add-room.page.html',
    styleUrls: ['./add-room.page.scss'],
    imports: [IonLabel, IonTitle, IonText, IonContent, IonItem, IonInput, IonButton, IonSelect, IonSelectOption, CommonModule, ReactiveFormsModule]
})
export class AddRoomPage implements OnInit {
    // addRoomData: AddRoomData = {
    //     room_number: 101,
    //     room_type: RoomType.Double,
    //     capacity: 2,
    //     price_per_night: 150, //va aggiunta la currency visualmente
    //     hotel_id: 1, //vanno prima creati
    //     description: "Camera doppia con vista"
    // }
    roomForm!: FormGroup;

    roomTypes = Object.values(RoomType) //Mettendo keys sarebbe stato indifferente in quanto avremmo comunque tenuto la pipe "Titlecase" per scelta nell'html

    //loading: boolean = true;
    constructor(private fb: FormBuilder, private addRoomService: AddRoomService) { }

    //Inseriamo più regole rispetto al backend per scelta personale
    ngOnInit(): void {
        this.roomForm = this.fb.group(
            {
                room_number: ['', [Validators.required, Validators.maxLength(3)]],
                room_type: [RoomType.Single, Validators.required],
                capacity: ['', [Validators.required, Validators.max(4)]], //TODO: La capienza basare su room_type
                price_per_night: ['', [Validators.required, Validators.maxLength(4)]],
                hotel_id: ['', [Validators.required, Validators.max(10)]],
                description: ['', [Validators.maxLength(100)]]
            }
        );
    }

    onSubmit() {
        if (this.roomForm.invalid) { //il pulsante di submit diventa disabled se gli input non sono stati tutti inseriti correttamente, questa è un'ulteriore guard
            this.roomForm.markAllAsTouched()
            return;
        }
        console.log("Dati per la creazione della stanza inviati ")

        const addRoomData: AddRoomData = this.roomForm.value

        this.addRoomService.addRoom(addRoomData.room_number, addRoomData.room_type, addRoomData.capacity, addRoomData.price_per_night, addRoomData.hotel_id, addRoomData.description).subscribe({
            next: (res: any) => {
                console.log(res); //deve diventare un alert
            },
            error: (err: any) => {
                console.error(err); //anche questo
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