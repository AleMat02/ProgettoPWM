import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { PositionData } from '../../interfaces/nearby-hotels.interface';
import { NearbyHotelsService } from 'src/app/services/nearby-hotels.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-map',
  templateUrl: './nearby-hotels.page.html',
  styleUrls: ['./nearby-hotels.page.scss'],
  imports: [
    IonItem,
    IonLabel,
    IonCard,
    IonContent,
    CommonModule,
    FormsModule,
    IonCard,
    IonCardContent,
    IonButton,
    RouterLink,
    IonSelectOption,
    IonSelect
  ],
  standalone: true,
})
export class NearbyHotelsPage implements OnInit {
  positionData: PositionData = {
    lat: 0,
    lng: 0,
    radius: 0,
  };

  isLoggedIn = false;
  hotels: any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private nearbyHotelsService: NearbyHotelsService,
    private toastService: ToastService
  ) {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user; // true se l'utente è loggato, false altrimenti
    });
  }

  ngOnInit(): void {
    this.getCurrentPosition()
      .then((positionData: PositionData) => {
        this.fetchNearbyHotels(positionData);
      })
      .catch((error) => {
        this.toastService.presentErrorToast('Errore durante la geolocalizzazione');
        console.error('Errore durante la geolocalizzazione: ', error);
      });
  }

  async getCurrentPosition(): Promise<PositionData> {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.positionData.lat = position.coords.latitude;
      this.positionData.lng = position.coords.longitude;
      this.positionData.radius = 10; // Imposta un raggio predefinito di 20 km
      return this.positionData;
    } catch (error) {
      throw error;
    }
  }

  onRadiusChange(newRadius: number) {
    this.getCurrentPosition()
      .then((positionData: PositionData) => {
        positionData.radius = newRadius;
        this.fetchNearbyHotels(positionData);
      })
      .catch((error) => {
        this.toastService.presentErrorToast('Errore durante la geolocalizzazione');
        console.error('Errore durante la geolocalizzazione: ', error)
      });
  }

  fetchNearbyHotels(positionData: PositionData) {
    this.nearbyHotelsService.getNearbyHotels(positionData).subscribe({
      next: (response) => {
        this.hotels = [];
        if (response?.data?.hotels && Array.isArray(response.data.hotels)) {
          this.hotels = response.data.hotels;
        } else {
          console.warn('Nessun hotel trovato o risposta non valida:', response);
        }
      },
      error: (error) => {
        this.toastService.presentErrorToast('Errore durante il recupero degli hotel');
        console.error('Errore durante il recupero degli hotel:', error)
      }
    })
  }


  trackByHotelId(index: number, hotel: any) {
    return hotel.id;
  }
}