import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonGrid, IonRow, IonCol, IonButton, IonItem, IonSelect, IonSelectOption, IonContent } from '@ionic/angular/standalone';
import { AddRoomsService } from './add-rooms.service';

interface AddRoomData {
    room_number: number,
    room_type: string, //bisogna capire il tipo, nell'esempio della collezione consiglia "double"
    capacity: number,
    price_per_night: number, //va aggiunta la currency visualmente
    hotel_id: number, //vanno prima creati
    description?: string
}

@Component({
    selector: 'app-rooms',
    templateUrl: './add-rooms.page.html',
    styleUrls: ['./add-rooms.page.scss'],
    imports: [IonContent, IonItem, IonButton, IonSelect, IonSelectOption, CommonModule, FormsModule]
})
export class AddRoomsPage {
    addRoomData: AddRoomData = {
        room_number: 101,
        room_type: "double", //bisogna capire il tipo, nell'esempio della collezione consiglia "double"
        capacity: 2,
        price_per_night: 150, //va aggiunta la currency visualmente
        hotel_id: 1, //vanno prima creati
        description: "Camera doppia con vista"
    }
    //loading: boolean = true;
    constructor(private addRoomsService: AddRoomsService) { }

    addRoom() {
        this.addRoomsService.addRoom(this.addRoomData.room_number, this.addRoomData.room_type, this.addRoomData.capacity, this.addRoomData.price_per_night, this.addRoomData.hotel_id, this.addRoomData.description).subscribe({
            next: (res: any) => {
                console.log(res); //deve diventare un alert
            },
            error: (err: any) => {
                console.error(err); //anche questo
            }
        })
    }
}