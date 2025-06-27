import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonFab, IonIcon, IonList, IonCard, IonCardContent, IonCardHeader, IonSkeletonText, IonCardTitle, IonCardSubtitle, IonLabel, IonChip, IonButtons, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { HotelData } from 'src/app/interfaces/hotel.interface';
import { HotelsService } from 'src/app/services/hotels.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserRole } from 'src/app/interfaces/user.interface';
import { SkeletonContentComponent } from 'src/app/components/skeleton-content/skeleton-content.component';
import { NoDataComponent } from 'src/app/components/no-data/no-data.component';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.page.html',
  styleUrls: ['./hotels.page.scss'],
  standalone: true,
  imports: [IonIcon, IonCardHeader, IonLabel, IonChip, IonButtons, IonButton, IonCardTitle, IonCardSubtitle, IonCard, IonCardContent, IonItem, IonContent, IonFab, IonList, CommonModule, FormsModule, RouterLink, SkeletonContentComponent, NoDataComponent]
})
export class HotelsPage implements OnDestroy {
  hotels: HotelData[] = [];
  loading: boolean = true;
  userSub!: Subscription
  isAdmin: boolean = false;
  constructor(private hotelsService: HotelsService, private toastService: ToastService, private authService: AuthService) {
    this.userSub = this.authService.user$.subscribe(user =>
      this.isAdmin = user ? user.role === UserRole.Admin : false
    );
  }

  ionViewWillEnter() { //ionViewWillEnter fa sì che ogni volta che si entri nella pagina, il contenuto venga aggiornato. ngOnInit invece funziona solo quando la pagina viene inizializzata per la prima volta e non è adatta a ciò che ci serve
    this.getHotels()
  }

  getHotels() {
    this.hotelsService.getHotels().subscribe({
      next: (res: any) => {
        this.hotels = res.data.hotels;
        this.loading = false;
      },
      error: async (err: any) => {
        this.toastService.presentErrorToast("Errore durante il recupero degli hotel")
        console.error("Errore durante il recupero degli hotel: ", err);
        this.loading = false;
      }
    })
  }

  deleteHotel(id: number) { //* in caso mettere un modal di conferma
    this.hotelsService.deleteHotel(id).subscribe({
      next: (res: any) => {
        this.toastService.presentSuccessToast(res.message)
        this.loading = false;
        this.getHotels(); //aggiorniamo gli hotel disponibili dopo la cancellazione
      },
      error: async (err: any) => {
        this.toastService.presentErrorToast("Errore durante la cancellazione degli hotel")
        console.error("Errore durante la cancellazione degli hotel: ", err);
        this.loading = false;
      }
    })
  }

  ngOnDestroy(): void {
      this.userSub.unsubscribe()
  }
}

