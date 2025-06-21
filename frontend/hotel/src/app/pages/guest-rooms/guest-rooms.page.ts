import { Component, OnInit } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
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
export class GuestRoomsPage implements OnInit {
  availabilityForm: FormGroup = new FormGroup({}); // Inizializzazione vuota per evitare undefined
  rooms: any[] = [];
  hotelId: string | null = null;
  hotels: any[] = [];
  hotelsName: any[] = [];
  roomTypes = Object.values(RoomType);
  today: string = new Date().toISOString().split('T')[0]; // Data odierna in formato yyyy-MM-dd

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
    private bookingsService : BookingsService,
    private hotelsService: HotelsService
  ) {}

  ngOnInit() {
    this.hotelId = this.route.snapshot.paramMap.get('hotelId');
    this.availabilityForm = this.fb.group({
      hotel_id: [this.hotelId !== null && !isNaN(Number(this.hotelId)) ? Number(this.hotelId) :  1,[Validators.required]],
      check_in: ['', []],
      check_out: ['', []],
      room_type: ['',[]],
    });

    this.availabilityForm.get('check_in')?.valueChanges.subscribe(() => {
      this.resetCheckOutIfInvalid();
    });

    this.availabilityForm.get('check_out')?.valueChanges.subscribe(() => {
      this.resetCheckOutIfInvalid();
    });

    this.hotelsService.getHotels().subscribe({
      next: (res: any) => {
        if (res && res.data && Array.isArray(res.data.hotels)) {
          this.hotels = res.data.hotels;
        }     
      },
       error: (err: any) => {
        this.toastService.presentErrorToast('Errore nel recupero degli hotel');
        console.error('Errore nel recupero degli hotel: ', err);
      },
    });
  }

  onSubmit() {
    const formData = this.availabilityForm.value;
    const payload = {
      check_in : formData.check_in,
      check_out : formData.check_out,
      room_type : formData.room_type
    }
      this.guestRoomsService.getAviableRoomsByHotelId(payload, formData.hotel_id).subscribe({
          next: (res: any) => {
            for (let room of res.data.available_rooms) {
              this.rooms.push(room);
            }
            this.toastService.presentSuccessToast('Filtro applicato con successo');
          },
          error: async (err: any) => {
            this.toastService.presentErrorToast("Erorre nell'applicazione del filtro");
            console.error("Erorre nell'applicazione del filtro: ", err)
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

    addBookingPending(room_id: number){
    const bookingData: AddBookingData = {
        room_id : room_id,
        check_in : this.availabilityForm.get('check_in')?.value,
        check_out : this.availabilityForm.get('check_out')?.value
    };
    this.bookingsService.createBookingRequest(bookingData).subscribe({
      next: (res: any) => {
        this.toastService.presentSuccessToast('Prenotazione riuscita con successo');
        this.rooms = this.rooms.filter(room => room.id !== bookingData.room_id);
      },
      error: (err: any) => {
        this.toastService.presentErrorToast('Prenotazione fallita');
        console.error('Prenotazione fallita: ', err)
      }
    });
  }
  

  isFormFieldInvalid(field: string) {
    return Utils.isFormFieldInvalid(this.availabilityForm, field);
  }

  getFormErrorMessage(field: string) {
    return Utils.getFormErrorMessage(this.availabilityForm, field);
  }
}