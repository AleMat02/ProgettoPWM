import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonHeader, IonToolbar, IonTitle, IonFab, IonIcon, IonList, IonCard, IonCardContent, IonCardHeader, IonSkeletonText, IonCardTitle, IonCardSubtitle, IonLabel, IonChip, IonButtons, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { RoomsService } from 'src/app/services/rooms.service';
import { RoomData } from 'src/app/interfaces/room.interface';
import { ToastService } from 'src/app/services/toast.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserRole } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
  standalone: true,
  imports: [IonIcon, IonCardHeader, IonSkeletonText, IonLabel, IonChip, IonButtons, IonButton, IonCardTitle, IonCardSubtitle, IonCard, IonCardContent, IonItem, IonContent, IonFab, IonList, CommonModule, FormsModule, RouterLink]
})
export class RoomsPage implements OnDestroy {
  rooms: RoomData[] = [];
  loading: boolean = true;
  userSub!: Subscription
  isAdmin: boolean = false;

  constructor(private roomsService: RoomsService, private toastService: ToastService, private authService: AuthService) {
    this.userSub = this.authService.user$.subscribe(user => 
      this.isAdmin = user ? user.role === UserRole.Admin : false
    );
  }

  ionViewWillEnter() { //ionViewWillEnter fa sì che ogni volta che si entri nella pagina, il contenuto venga aggiornato. ngOnInit invece funziona solo quando la pagina viene inizializzata per la prima volta e non è adatta a ciò che ci serve
    this.getRooms()
  }

  getRooms() {
    this.roomsService.getRooms().subscribe({
      next: (res: any) => {
        this.rooms = res.data;
        this.loading = false;
      },
      error: async (err: any) => {
        this.toastService.presentErrorToast("Errore durante il recupero delle stanze");
        console.error("Errore durante il recupero delle stanze: ", err);
        this.loading = false;
      }
    })
  }

  deleteRoom(id: string) { //* in caso mettere un modal di conferma
    this.roomsService.deleteRoom(id).subscribe({
      next: (res: any) => {
        this.toastService.presentSuccessToast(res.message)
        this.loading = false;
        this.getRooms(); //aggiorniamo le stanze disponibili dopo la cancellazione
      },
      error: async (err: any) => {
        this.toastService.presentErrorToast("Errore durante la cancellazione delle stanze");
        console.error("Errore durante la cancellazione delle stanze: ", err);
        this.loading = false;
      }
    })
  }

  ngOnDestroy(): void {
      this.userSub.unsubscribe()
  }
}