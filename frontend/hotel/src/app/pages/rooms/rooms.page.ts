import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonSpinner, IonItem } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { RoomsService } from 'src/app/services/rooms.service';
import { RoomData } from 'src/app/interfaces/room.interface';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
  standalone: true,
  imports: [IonItem, IonGrid, IonContent, IonGrid, IonRow, IonCol, IonSpinner, CommonModule, FormsModule, RouterLink]
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

