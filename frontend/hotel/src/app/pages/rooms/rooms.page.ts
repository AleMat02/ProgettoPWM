import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonHeader, IonToolbar, IonTitle, IonFab, IonIcon, IonList, IonCard, IonCardContent, IonCardHeader, IonSkeletonText, IonCardTitle, IonCardSubtitle, IonLabel, IonChip, IonButtons, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { RoomsService } from 'src/app/services/rooms.service';
import { RoomData } from 'src/app/interfaces/room.interface';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
  standalone: true,
  imports: [IonIcon, IonCardHeader, IonSkeletonText, IonLabel, IonChip, IonButtons, IonButton, IonCardTitle, IonCardSubtitle, IonCard, IonHeader, IonCardContent, IonHeader, IonItem, IonToolbar, IonContent, IonTitle, IonFab, IonList, CommonModule, FormsModule, RouterLink]
})
export class RoomsPage {
  rooms: RoomData[] = [];
  loading: boolean = true;
  constructor(private roomsService: RoomsService, private toastService: ToastService) { }

  ionViewWillEnter() { //ionViewWillEnter fa sì che ogni volta che si entri nella pagina, il contenuto venga aggiornato. ngOnInit invece funziona solo quando la pagina viene inizializzata per la prima volta e non è adatta a ciò che ci serve
    this.getRooms()
  }

  getRooms() {
    this.roomsService.getRooms().subscribe({
      next: (res: any) => {
        console.log("Stanze recuperate con successo.");
        this.rooms = res.data;
        this.loading = false;
        console.log(res)
      },
      error: async (err: any) => {
        console.error("Errore durante il recupero delle stanze: ", err);
        this.loading = false; //TODO: Forse bisognerebbe aggiungere un this.error per visualizzazione custom in caso di errore
      }
    })
  }

  deleteRoom(id: string) { //* in caso mettere un modal di conferma
    this.roomsService.deleteRoom(id).subscribe({
      next: (res: any) => {
        this.toastService.presentSuccessToast(res.message)
        this.loading = false;
        this.getRooms(); //aggiorniamo le stanze disponibili dopo la cancellazione
        console.log(res)
      },
      error: async (err: any) => {
        console.error("Errore durante il recupero delle stanze: ", err);
        this.loading = false;
      }
    })
  }

}

