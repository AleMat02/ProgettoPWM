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
  IonLabel,
  IonText,
  IonList,
  IonSelectOption,
  IonSelect, IonCard, IonCardContent, IonIcon
} from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as Utils from 'src/app/utils';
import { SearchData } from 'src/app/interfaces/booking-management.interface';
import { BookingManagementService } from 'src/app/services/booking-management.service';
import { HotelsService } from 'src/app/services/hotels.service';
import { HotelData } from 'src/app/interfaces/hotel.interface';
import { BookingData } from 'src/app/interfaces/booking-management.interface';
import { SkeletonContentComponent } from "../../../components/skeleton-content/skeleton-content.component";
import { NoDataComponent } from 'src/app/components/no-data/no-data.component';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserRole } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-booking-management',
  templateUrl: './booking-management.page.html',
  styleUrls: ['./booking-management.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonCardContent,
    IonCard,
    IonContent,
    CommonModule,
    IonItem,
    IonLabel,
    IonText,
    IonInput,
    IonButton,
    ReactiveFormsModule,
    IonList,
    IonSelectOption,
    IonSelect,
    SkeletonContentComponent,
    NoDataComponent]
})
export class BookingManagementPage {
  searchForm: FormGroup = new FormGroup({});
  pendingBookings: BookingData[] = []; // Array per memorizzare le prenotazioni in attesa
  availabilityForm: FormGroup = new FormGroup({}); // Inizializzazione vuota per evitare undefined
  hotels: HotelData[] = [];
  hotelsName: String[] = [];
  today: string = new Date().toISOString().split('T')[0]; // Data odierna in formato yyyy-MM-dd
  userSub!: Subscription
  isAdmin: boolean = false;
  loading: boolean = true;

  //Form Builder permette un'implementazione più rapida della validazione rispetto al solo formGroup
  constructor(
    private fb: FormBuilder,
    private bookingManagementService: BookingManagementService,
    private toastService: ToastService,
    private hotelsService: HotelsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      hotel_id: [0, { validators: [Validators.required, Validators.min(0)] }],
      from_date: [this.today, []],
    });

    this.userSub = this.authService.user$.subscribe(user =>
      this.isAdmin = user ? user.role === UserRole.Admin : false
    );

    this.hotelsService.getHotels().subscribe({
      next: (res: any) => {
        this.hotels = res.data.hotels;
        if (this.hotels.length > 0) {
          this.searchForm.get('hotel_id')?.setValue(this.hotels[0].id);
          this.loading = false;
        }
      },
      error: (err: any) => {
        this.toastService.presentErrorToast("Errore nel recupero degli hotel");
        console.error("Errore nel recupero degli hotel: ", err)
        this.loading = false;
      },
    });

    this.searchForm.valueChanges.subscribe(() => {
      this.onSubmit();
    });

    this.onSubmit()
  }

  onSubmit() {
    this.loading = true;
    this.pendingBookings = [];
    this.bookingManagementService.getPendingBookings(this.searchForm.value).subscribe({
      next: (res: any) => {
        this.pendingBookings = res.data.bookings;
        this.loading = false;
      },
      error: (err: any) => {
        this.toastService.presentErrorToast("Errore nel recupero delle prenotazioni");
        console.error("Errore nel recupero delle prenotazioni: ", err);
        this.loading = false;
      },
    });
  }

  isFormFieldInvalid(field: string) {
    return Utils.isFormFieldInvalid(this.searchForm, field);
  }

  getFormErrorMessage(field: string) {
    return Utils.getFormErrorMessage(this.searchForm, field);
  }

  manageBooking(bookingId: number, decision: boolean) {
    this.bookingManagementService
      .manageBookingRequest(bookingId, decision)
      .subscribe(
        {
          next: (res: any) => {
            if (decision) {
              this.toastService.presentSuccessToast('Prenotazione accettata con successo');
            } else {
              this.toastService.presentSuccessToast('Prenotazione rifiutata con successo');
            }
            this.onSubmit()
          },
          error: (err: any) => {
            this.toastService.presentErrorToast("Errore nella gestione della prenotazione");
            console.error("Errore nella gestione della prenotazione: ", err)
          },
        }
      );
  }
}