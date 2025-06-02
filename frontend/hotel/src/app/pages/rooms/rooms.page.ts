import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonSpinner, IonItem } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { RoomsService } from './rooms.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
  standalone: true,
  imports: [IonItem, IonGrid, IonContent, IonGrid, IonRow, IonCol, IonSpinner, CommonModule, FormsModule, RouterLink]
})
export class RoomsPage implements OnInit {
  rooms: any;
  loading: boolean = true;
  constructor(private roomsService: RoomsService) { }

  ngOnInit() {
    this.roomsService.getRooms().subscribe({
      next: (data) => {
        console.log("Stanze recuperate con successo.");
        this.rooms = data;
        this.loading = false;
        console.log(data)
      },
      error: async (err: any) => {
        console.error("Errore durante il recupero delle stanze: ", err);
        this.loading = false;
      }
    })
  }

}

