import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IonButton, IonItem, IonSelect, IonSelectOption, IonContent, IonInput } from '@ionic/angular/standalone';

@Component ({
    selector: 'app-add-hotel',
    templateUrl: './add-hotel.page.html',
    styleUrls: ['./add-hotel.page.scss'],
    imports: [IonContent, IonItem, IonInput, IonButton, IonSelect, IonSelectOption, CommonModule, ReactiveFormsModule]
})
export class AddHotelPage {

}