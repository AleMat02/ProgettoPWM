import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonFab, IonIcon, IonList, IonCard, IonCardContent, IonCardHeader, IonSkeletonText, IonCardTitle, IonCardSubtitle, IonLabel, IonChip, IonButtons, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { HotelData } from 'src/app/interfaces/hotel.interface';
import { HotelsService } from 'src/app/services/hotels.service';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.page.html',
  styleUrls: ['./hotels.page.scss'],
  standalone: true,
  imports: [IonIcon, IonCardHeader, IonSkeletonText, IonLabel, IonChip, IonButtons, IonButton, IonCardTitle, IonCardSubtitle, IonCard, IonCardContent, IonItem, IonContent, IonFab, IonList, CommonModule, FormsModule, RouterLink]
})
export class HotelsPage {
  hotels: HotelData[] = [];
  loading: boolean = true;
  constructor(private hotelsService: HotelsService, private toastService: ToastService) { }

  ionViewWillEnter() { //ionViewWillEnter fa sì che ogni volta che si entri nella pagina, il contenuto venga aggiornato. ngOnInit invece funziona solo quando la pagina viene inizializzata per la prima volta e non è adatta a ciò che ci serve
    this.getHotels()
  }

  getHotels() {
    this.hotelsService.getHotels().subscribe({
      next: (res: any) => {
        console.log("Hotel recuperati con successo.");
        this.hotels = res.data.hotels;
        this.loading = false;
        console.log(res)
      },
      error: async (err: any) => {
        console.error("Errore durante il recupero degli hotel: ", err);
        this.loading = false; //TODO: Forse bisognerebbe aggiungere un this.error per visualizzazione custom in caso di errore
      }
    })
  }

  deleteHotel(id: string) { //* in caso mettere un modal di conferma
    this.hotelsService.deleteHotel(id).subscribe({
      next: (res: any) => {
        this.toastService.presentSuccessToast(res.message)
        this.loading = false;
        this.getHotels(); //aggiorniamo gli hotel disponibili dopo la cancellazione
        console.log(res)
      },
      error: async (err: any) => {
        console.error("Errore durante il recupero degli hotel: ", err);
        this.loading = false;
      }
    })
  }

}

