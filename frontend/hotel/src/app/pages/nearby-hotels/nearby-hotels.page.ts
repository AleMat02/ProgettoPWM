import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  
} from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { RouterLink} from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { PositionData } from '../../interfaces/nearby-hotels.interface';
import { NearbyHotelsService } from 'src/app/services/nearby-hotels.service';

@Component({
  selector: 'app-map',
  templateUrl: './nearby-hotels.page.html',
  styleUrls: ['./nearby-hotels.page.scss'],
  imports: [
    IonCard,
    IonContent,
    CommonModule,
    FormsModule,
    IonCard,
    IonCardContent,
    IonButton,
    RouterLink
  ],
  standalone: true,
})
export class NearbyHotelsPage implements OnInit {
  positionData: PositionData = {
    lat: 0,
    lng: 0,
    radius: 0,
  };

  hotels: any[] = [];

  constructor(
    private http: HttpClient,
    private nearbyHotelsService: NearbyHotelsService
  ) {}

  ngOnInit(): void {
    this.getCurrentPosition()
      .then((positionData: PositionData) => {
        this.fetchNearbyHotels(positionData);
      })
      .catch((error) => {
        console.error('Errore durante la geolocalizzazione:', error);
      });
  }

  async getCurrentPosition(): Promise<PositionData> {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.positionData.lat = position.coords.latitude;
      this.positionData.lng = position.coords.longitude; // Corretto da 'lang' a 'lng'
      this.positionData.radius = 5; // Imposta un raggio predefinito di 20 km
      return this.positionData;
    } catch (error) {
      console.error('Errore nella geolocalizzazione:', error);
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
        console.error('Errore durante la geolocalizzazione:', error);
      });
  }

  fetchNearbyHotels(positionData: PositionData) {
    this.nearbyHotelsService.getNearbyHotels(positionData).subscribe(
      (response: any) => {
        // Svuota la lista prima di aggiungere nuovi hotel
        this.hotels = [];
        // Verifica che la risposta abbia la struttura attesa
        if (response && response.data && Array.isArray(response.data.hotels)) {
          this.hotels = response.data.hotels;
          console.log('Hotel trovati:', this.hotels);
        } else {
          console.warn('Nessun hotel trovato o risposta non valida:', response);
        }
      },
      (error: any) => {
        console.error('Errore durante il recupero degli hotel:', error);
      }
    );
    // Log per debug
    console.log('Chiamata fetchNearbyHotels con:', positionData);
  }

  trackByHotelId(index: number, hotel: any) {
    return hotel.id;
  }
}