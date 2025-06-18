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
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.hotelId = this.route.snapshot.paramMap.get('hotelId');
    this.availabilityForm = this.fb.group({
      hotel_name: [
        this.hotelsName[
          this.hotelId !== null && !isNaN(Number(this.hotelId))
            ? Number(this.hotelId) + 1
            : 0
        ] || '',
        Validators.required,
      ],
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

    this.availabilityForm.get('room_type')?.valueChanges.subscribe((selectedRoomType: RoomType) => {
        const formCapacity = this.availabilityForm.get('capacity');
        if (selectedRoomType && formCapacity) {
          // selectedRoomType potrebbe essere null se il campo è resettato
          const newCapacity = this.ROOM_CAPACITIES[selectedRoomType];
          formCapacity.setValue(newCapacity);
        }
      });

    this.guestRoomsService.getAllHotels().subscribe({
      next: (res: any) => {
        if (res && res.data && Array.isArray(res.data.hotels)) {
          this.hotels = res.data.hotels;
          this.hotelsName = this.hotels.map((h) => h.name);

          // Se hotelId è presente, seleziona l'hotel corrispondente
          if (this.hotelId) {
            const hotelIndex = this.hotels.findIndex(
              (h) => String(h.id) === String(this.hotelId)
            );
            if (hotelIndex !== -1) {
              this.availabilityForm
                .get('hotel_name')
                ?.setValue(this.hotels[hotelIndex].name);
              this.onSubmit(); // Invia subito il form
            } else {
              // fallback: seleziona il primo hotel
              this.availabilityForm.get('hotel_name')?.setValue(this.hotelsName[0] || '');
            }
          } else {
            // fallback: seleziona il primo hotel
            this.availabilityForm
              .get('hotel_name')
              ?.setValue(this.hotelsName[0] || '');
          }
        }
      },
      error: (e: any) => {
        this.toastService.presentErrorToast('Errore nel recupero degli hotel');
      },
    });

  }

  onSubmit() {
    const formData = this.availabilityForm.value;
    const selectedHotelName = formData.hotel_name;
    const hotelIndex = this.hotels.findIndex(
      (h) => h.name === selectedHotelName
    );
    const hotel_id = hotelIndex !== -1 ? this.hotels[hotelIndex].id : null;
    this.rooms = [];
    const payload = {
      check_in: formData.check_in,
      check_out: formData.check_out,
      room_type: formData.room_type,
    };
    if (hotel_id !== null) {
      this.guestRoomsService
        .getAviableRoomsByHotelId(payload, hotel_id)
        .subscribe({
          next: (res: any) => {
            for (let room of res.data.available_rooms) {
              this.rooms.push(room);
            }
            this.toastService.presentSuccessToast(
              'Filtro applicato con successo'
            );
          },
          error: async (err: any) => {
            this.toastService.presentErrorToast('Erorre applicazione filtro');
          },
        });
    } else {
      this.toastService.presentErrorToast('Hotel non trovato');
    }
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


  isFormFieldInvalid(field: string) {
    return Utils.isFormFieldInvalid(this.availabilityForm, field);
  }

  getFormErrorMessage(field: string) {
    return Utils.getFormErrorMessage(this.availabilityForm, field);
  }
}