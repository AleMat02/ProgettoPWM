import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonSelectOption,
  IonSelect,
  IonText,
  IonCard,
  IonInput
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
import { BookingData } from 'src/app/interfaces/booking-management.interface';
import { SkeletonContentComponent } from "../skeleton-content/skeleton-content.component";

@Component({
  selector: 'app-bookings-history-form',
  templateUrl: './bookings-history-form.component.html',
  styleUrls: ['./bookings-history-form.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonText,
    IonContent,
    CommonModule,
    FormsModule,
    IonSelect,
    IonSelectOption,
    IonItem,
    ReactiveFormsModule,
    IonLabel,
    IonInput,
    IonCard,
    SkeletonContentComponent],
})
export class BookingsHistoryFormComponent implements OnInit, OnDestroy {
  @Input() hideUserIdInput: boolean = false;

  userSub!: Subscription;
  searchForm!: FormGroup;
  userBookings: BookingData[] = [];
  userBookingsDisplayed: any[] = [];
  lastFetchedUserId: number | null = null;
  loading: boolean = false;


  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private bookingsService: BookingsService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.userSub = this.authService.user$.subscribe((user) => {
      if (user) {
        this.searchForm = this.fb.group({
          user_id: [
            this.hideUserIdInput ? user.id : 1,
            { validators: [Validators.required, Validators.min(0)] },
          ],
          status: ['pending', []],
        });
      }
    });

    this.searchForm.valueChanges.subscribe(() => {
      this.onSubmit();
    });

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
    this.loading = true;

    if (currentUserId !== this.lastFetchedUserId) {
      this.userBookings = [];
      this.bookingsService.getBookings(currentUserId).subscribe({
        next: (res: any) => {
          this.lastFetchedUserId = currentUserId;
          this.userBookings = res.data.bookings;
          this.userBookingsDisplayed = this.userBookings.filter(
            (booking: any) => booking.status === currentStatus
          );
          this.loading = false;
        },
        error: (err: any) => {
          this.toastService.presentErrorToast('Errore durante il recupero dei dati');
          console.error("Errore durante il recupero dei dati: ", err);
          this.loading = false;
        },
      });
    } else {
      this.userBookingsDisplayed = this.userBookings.filter(
        (booking: any) => booking.status === currentStatus
      );
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}