import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonItem,
  IonContent,
  IonInput,
  IonTitle,
  IonLabel,
  IonText,
  IonList,
} from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';
import * as Utils from 'src/app/utils';
import { SearchData } from 'src/app/interfaces/booking-management.interface';
import { BookingManagementService } from 'src/app/services/booking-management.service';

@Component({
  selector: 'app-booking-management',
  templateUrl: './booking-management.page.html',
  styleUrls: ['./booking-management.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonTitle,
    CommonModule,
    IonItem,
    IonLabel,
    IonText,
    IonInput,
    IonButton,
    ReactiveFormsModule,
    IonList,
  ],
})
export class BookingManagementPage {
  searchForm: FormGroup = new FormGroup({});

  pendingBookings: any[] = []; // Array per memorizzare le prenotazioni in attesa

  //Form Builder permette un'implementazione più rapida della validazione rispetto al solo formGroup
  constructor(
    private fb: FormBuilder,
    private bookingManagementService: BookingManagementService,
    private toastService: ToastService,
    private router: Router // aggiungi Router come dipendenza
  ) {}

  searchFormData!: SearchData;
  //Inseriamo più regole rispetto al backend per scelta personale
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      hotel_id: [null, [Validators.min(0)]],
      from_date: ['', []],
      limit: [50, [Validators.min(50)]], // coerente con la select
    });

    // Invia richiesta al backend anche senza filtro
    this.bookingManagementService
      .getPendingBookings(this.searchForm.value)
      .subscribe({
        next: (res: any) => {
          console.log('Prenotazioni in attesa:', res);

          for (const booking of res.data.bookings) {
            // Aggiungi la prenotazione all'array
            this.pendingBookings.push(booking);
          }
        },
        error: (err: any) => {
          this.toastService.handleErrorToast(err);
        },
      });
  }

  // Funzione che resetta check_out se la data di check-in è superiore a quella di check-out

  onSubmit() {
    this.pendingBookings = []; // Svuota l'array delle prenotazioni in attesa
    this.searchFormData = this.searchForm.value;
    this.bookingManagementService
      .getPendingBookings(this.searchFormData)
      .subscribe({
        next: (res: any) => {
          this.toastService.presentSuccessToast(
            'Filtro applicato con successo'
          );
          console.log('Prenotazioni in attesa:', res);
          for (const booking of res.data.bookings) {
            this.pendingBookings.push(booking);
          }
        },
        error: (err: any) => {
          this.toastService.handleErrorToast(err);
        },
      });
  }

  isFormFieldInvalid(field: string) {
    return Utils.isFormFieldInvalid(this.searchForm, field);
  }

  getFormErrorMessage(field: string) {
    return Utils.getFormErrorMessage(this.searchForm, field);
  }

  manageBooking(bookingId: number, decision: string) {
    this.bookingManagementService
      .manageBookingRequest(bookingId, decision)
      .subscribe({
        next: (res: any) => {
          if (decision === 'accept') {
            this.toastService.presentSuccessToast(
              'Prenotazione accettata con successo'
            );
          } else if (decision === 'reject') {
            this.toastService.presentSuccessToast(
              'Prenotazione rifiutata con successo'
            );
          }
          this.pendingBookings = this.pendingBookings.filter(
            (booking) => booking.id !== bookingId
          );
        },
        error: (err: any) => {
          this.toastService.handleErrorToast(err);
        },
      });
  }
}