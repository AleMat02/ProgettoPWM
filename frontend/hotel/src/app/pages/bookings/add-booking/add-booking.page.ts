import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonInput } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CreateBookingRequestService } from 'src/app/services/add-booking.service';

@Component({
    selector: 'app-add-booking',
    templateUrl: './add-booking.page.html',
    styleUrls: ['./add-booking.page.scss'],
    standalone: true,
    imports: [IonInput, IonItem, IonButton, IonContent, CommonModule, FormsModule]
})
export class AddBookingPage {
    room_id: number = 0;
    check_in_date: string = '';
    check_out_date: string = '';

    constructor(private createBookingRequestService: CreateBookingRequestService, private router: Router) { }

    createBookingRequest() { //TODO: Poi va aggiunta l'interfaccia e bisogna semplificare tutti gli invii dei dati come ho fatto per la creazione degli hotel
        this.createBookingRequestService.createBookingRequest(this.room_id, this.check_in_date, this.check_out_date).subscribe({
            next: (data) => {
                console.log(data);
                this.router.navigate(['/bookings']); // Reindirizza alla pagina delle prenotazioni dopo la creazione della richiesta
            },
            error: (err: any) => {
                console.error('Errore durante la creazione della richiesta di prenotazione: ', err);
                alert('Errore durante la creazione della richiesta di prenotazione. Riprova.');
            },
        });
    }
}