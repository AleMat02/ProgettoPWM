import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonTitle,
  IonCard,
  IonGrid,
  IonRow,
  IonCardSubtitle,
  IonCol,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonLabel,
  IonText,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as Utils from 'src/app/utils';
import { GuestRoomsService } from 'src/app/services/guest-rooms.service';
import { RoomType } from 'src/app/interfaces/room.interface';
import { ToastService } from 'src/app/services/toast.service';
import { AddBookingData } from 'src/app/interfaces/add-booking.interface';
import { BookingsService } from 'src/app/services/bookings.service';
import { HotelsService } from 'src/app/services/hotels.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-guest-rooms',
  templateUrl: './guest-rooms.page.html',
  styleUrls: ['./guest-rooms.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonTitle,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonCard,
    IonGrid,
    IonRow,
    IonCardSubtitle,
    IonCol,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonInput,
    IonButton,
    IonLabel,
    IonText,
    IonSelect,
    IonSelectOption,
  ],
})
export class GuestRoomsPage implements OnInit, OnDestroy {
  availabilityForm: FormGroup = new FormGroup({}); // Inizializzazione vuota per evitare undefined
  rooms: any[] = [];
  hotelId: string | null = null;
  hotels: any[] = [];
  hotelsName: any[] = [];
  roomTypes = Object.values(RoomType);
  today: string = new Date().toISOString().split('T')[0]; // Data odierna in formato yyyy-MM-dd
  userSub!: Subscription;
  currentUser: boolean = false;

  readonly ROOM_CAPACITIES: { [key in RoomType]: number } = {
    [RoomType.Single]: 1,
    [RoomType.Double]: 2,
    [RoomType.Family]: 4,
  };

  constructor(
    private fb: FormBuilder,
    private guestRoomsService: GuestRoomsService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private bookingsService: BookingsService,
    private hotelsService: HotelsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.hotelId = this.route.snapshot.paramMap.get('hotelId');
    this.availabilityForm = this.fb.group({
      hotel_id: [
        this.hotelId !== null && !isNaN(Number(this.hotelId))
          ? Number(this.hotelId)
          : 1,
        [Validators.required],
      ],
      check_in: ['', []],
      check_out: ['', []],
      room_type: ['', []],
    });

    this.onSubmit();

    this.userSub = this.authService.user$.subscribe(user => this.currentUser = !!user)

    this.availabilityForm.valueChanges.subscribe(() => {
      this.resetCheckOutIfInvalid();
      this.onSubmit();
    });

    this.hotelsService.getHotels().subscribe({
      next: (res: any) => {
        if (res && res.data && Array.isArray(res.data.hotels)) {
          this.hotels = res.data.hotels;
        }
      },
      error: (err: any) => {
        this.toastService.presentErrorToast('Errore nel recupero degli hotel');
      },
    });
  }

  onSubmit() {
    this.rooms = [];
    const formData = this.availabilityForm.value;
    const payload = {
      check_in: formData.check_in,
      check_out: formData.check_out,
      room_type: formData.room_type,
    };
    this.guestRoomsService
      .getAvailableRoomsByHotelId(payload, formData.hotel_id)
      .subscribe({
        next: (res: any) => {
          this.rooms = res.data.available_rooms;
        },
        error: async (err: any) => {
          this.toastService.presentErrorToast(
            "Erorre nell'applicazione del filtro"
          );
          console.error("Erorre nell'applicazione del filtro: ", err);
        },
      });
  }

  resetCheckOutIfInvalid() {
    const checkInValue = this.availabilityForm.get('check_in')?.value;
    const checkOutValue = this.availabilityForm.get('check_out')?.value;
    if (checkInValue && checkOutValue) {
      const checkInDate = new Date(checkInValue);
      const checkOutDate = new Date(checkOutValue);
      if (checkInDate > checkOutDate) {
        this.availabilityForm.get('check_out')?.setValue('');
      }
    }
  }

  addPendingBooking(room_id: number) {
    if(!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    const bookingData: AddBookingData = {
      room_id: room_id,
      check_in: this.availabilityForm.get('check_in')?.value,
      check_out: this.availabilityForm.get('check_out')?.value,
    };

    this.bookingsService.createBookingRequest(bookingData).subscribe({
      next: (res: any) => {
        this.toastService.presentSuccessToast(
          'Prenotazione effettuata con successo'
        );
        this.rooms = this.rooms.filter(
          (room) => room.id !== bookingData.room_id
        );
      },
      error: (err: any) => {
        this.toastService.presentErrorToast('Prenotazione fallita');
        console.error('Prenotazione fallita: ', err);
      },
    });
  }

  isFormFieldInvalid(field: string) {
    return Utils.isFormFieldInvalid(this.availabilityForm, field);
  }

  getFormErrorMessage(field: string) {
    return Utils.getFormErrorMessage(this.availabilityForm, field);
  }

  ngOnDestroy(): void {
      this.userSub.unsubscribe()
  }
}