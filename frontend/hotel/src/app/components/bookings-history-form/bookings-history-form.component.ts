import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonSelectOption,
  IonSelect,
  IonText,
  IonTitle,
} from '@ionic/angular/standalone';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { BookingsService } from 'src/app/services/bookings.service';
import * as Utils from 'src/app/utils';

@Component({
  selector: 'app-bookings-history-form',
  templateUrl: './bookings-history-form.component.html',
  styleUrls: ['./bookings-history-form.component.scss'],
  standalone: true,
  imports: [
    IonText,
    IonContent,
    CommonModule,
    FormsModule,
    IonSelect,
    IonSelectOption,
    IonItem,
    ReactiveFormsModule,
    IonButton,
    IonLabel,
    IonTitle,
  ],
})
export class BookingsHistoryFormComponent implements OnInit, OnDestroy {
  
  @Input() showUserIdInput: boolean = false; // Inizialmente impostato a true, cambia in base al ruolo

  userSub!: Subscription;
  searchForm!: FormGroup;
  userBookings: any[] = []; // Array per memorizzare le prenotazioni
  userBookingsDisplayed: any[] = [];
  lastFetchedUserId: number | null = null; 

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private bookingsService: BookingsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user$.subscribe((user) => {
      if (user) {
        this.searchForm = this.fb.group({
          user_id: [
            this.showUserIdInput ? user.id : null,
            { validators: [Validators.required, Validators.min(0)] },
          ],
          status: ['pending', []],
        });
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  isFormFieldInvalid(field: string) {
    return Utils.isFormFieldInvalid(this.searchForm, field);
  }

  getFormErrorMessage(field: string) {
    return Utils.getFormErrorMessage(this.searchForm, field);
  }



  onSubmit() {
    const currentUserId = this.searchForm.value.user_id;
    const currentStatus = this.searchForm.value.status;
    this.userBookingsDisplayed = [];

    if (currentUserId !== this.lastFetchedUserId) {
      this.userBookings = [];
      this.bookingsService.getBookings(currentUserId).subscribe({
        next: (res: any) => {
          this.lastFetchedUserId = currentUserId;
          this.userBookings = res.data.bookings;
          this.userBookingsDisplayed = this.userBookings.filter(
            (booking: any) => booking.status === currentStatus
          );
        },
        error: (err: any) => {
          this.toastService.presentErrorToast('Errore durante il recupero dei dati');
          console.error("Errore durante il recupero dei dati: ", err)
        },
      });
    } else {
      this.userBookingsDisplayed = this.userBookings.filter(
        (booking: any) => booking.status === currentStatus
      );
    }
  }
}