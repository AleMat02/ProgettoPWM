import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
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
  IonSelectOption
} from '@ionic/angular/standalone';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as Utils from 'src/app/utils';
import { GuestRoomsService } from 'src/app/services/guest-rooms.service';
import { RoomData, RoomType } from 'src/app/interfaces/room.interface';
import { ToastService } from 'src/app/services/toast.service';
import { AddBookingData } from 'src/app/interfaces/add-booking.interface';
import { BookingsService } from 'src/app/services/bookings.service';
import { HotelsService } from 'src/app/services/hotels.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NoDataComponent } from 'src/app/components/no-data/no-data.component';
import { HotelData } from 'src/app/interfaces/hotel.interface';
import { SkeletonContentComponent } from 'src/app/components/skeleton-content/skeleton-content.component';

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
    NoDataComponent,
    NgOptimizedImage,
    SkeletonContentComponent
  ],
})
export class GuestRoomsPage implements OnInit, OnDestroy {
  availabilityForm: FormGroup = new FormGroup({});
  rooms: RoomData[] = [];
  hotels: HotelData[] = [];
  hotelsName: string[] = [];
  roomTypes = Object.values(RoomType);
  today: string = new Date().toISOString().split('T')[0]; // Data odierna in formato yyyy-MM-dd
  userSub!: Subscription;
  currentUser: boolean = false;
  loading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private guestRoomsService: GuestRoomsService,
    private toastService: ToastService,
    private bookingsService: BookingsService,
    private hotelsService: HotelsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let initialHotelId: number | null = null;
    const routeHotelId = this.route.snapshot.paramMap.get('hotelId');
    if (routeHotelId && !isNaN(Number(routeHotelId))) {
      initialHotelId = Number(routeHotelId);
    }

    this.availabilityForm = this.fb.group({
      hotel_id: [initialHotelId, [Validators.required]],
      check_in: ['', []],
      check_out: ['', []],
      room_type: ['', []],
    });

    this.userSub = this.authService.user$.subscribe(user => this.currentUser = !!user);

    this.hotelsService.getHotels().subscribe({
      next: (res: any) => {
        if (res && res.data && Array.isArray(res.data.hotels)) {
          this.hotels = res.data.hotels;

          //Se c'è un hotelId dalla route seleziona quello, altrimenti il primo
          if (this.hotels.length > 0) {
            let hotelIdToSet = initialHotelId;

            if (!hotelIdToSet || !this.hotels.some(h => h.id === hotelIdToSet)) {
              hotelIdToSet = this.hotels.slice().sort((a, b) => a.id - b.id)[0].id;
            }

            this.availabilityForm.get('hotel_id')?.setValue(hotelIdToSet);
            this.onSubmit();
          }
          this.loading = false;
        }
      },
      error: (err: any) => {
        this.toastService.presentErrorToast('Errore nel recupero degli hotel');
        console.error('Errore nel recupero degli hotel: ', err)
        this.loading = false;
      },
    });

    this.availabilityForm.valueChanges.subscribe(() => {
      this.resetCheckOutIfInvalid();
      this.onSubmit();
    });
  }

  onSubmit() {
    this.loading = true;
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
          this.loading = false;
        },
        error: async (err: any) => {
          this.toastService.presentErrorToast("Errore nell'applicazione del filtro");
          console.error("Errore nell'applicazione del filtro: ", err);
          this.loading = false;
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
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

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
        this.loading = false;
      },
      error: (err: any) => {
        this.toastService.presentErrorToast('Prenotazione fallita');
        console.error('Prenotazione fallita: ', err);
        this.loading = false;
      },
    });
  }

  isFormFieldInvalid(field: string) {
    return Utils.isFormFieldInvalid(this.availabilityForm, field);
  }

  getFormErrorMessage(field: string) {
    return Utils.getFormErrorMessage(this.availabilityForm, field);
  }

  getRoomImage(roomType: RoomType): string {
    switch (roomType) {
      case RoomType.Single:
        return 'assets/single-room.jpg';
      case RoomType.Double:
        return 'assets/double-room.jpg';
      case RoomType.Family:
        return 'assets/family-room.jpg';
      default:
        return 'assets/family-room.jpg';
    }
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe()
  }
}