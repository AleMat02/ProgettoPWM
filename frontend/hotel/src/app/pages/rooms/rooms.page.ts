import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonHeader, IonToolbar, IonTitle, IonFab, IonIcon, IonList, IonCard, IonCardContent, IonCardHeader, IonSkeletonText, IonCardTitle, IonCardSubtitle, IonLabel, IonChip, IonButtons, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { RoomsService } from 'src/app/services/rooms.service';
import { RoomData } from 'src/app/interfaces/room.interface';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
  standalone: true,
  imports: [IonIcon, IonCardHeader, IonSkeletonText, IonLabel, IonChip, IonButtons, IonButton, IonCardTitle, IonCardSubtitle, IonCard, IonHeader, IonCardContent, IonHeader, IonItem, IonToolbar, IonContent, IonTitle, IonFab, IonList, CommonModule, FormsModule, RouterLink]
})
export class RoomsPage implements OnInit {
  rooms: RoomData[] = [];
  loading: boolean = true;
  constructor(private roomsService: RoomsService) { }

  ngOnInit() {
    this.roomsService.getRooms().subscribe({
      next: (res: any) => {
        console.log("Stanze recuperate con successo.");
        this.rooms = res.data;
        this.loading = false;
        console.log(res)
      },
      error: async (err: any) => {
        console.error("Errore durante il recupero delle stanze: ", err);
        this.loading = false;
      }
    })
  }

}

