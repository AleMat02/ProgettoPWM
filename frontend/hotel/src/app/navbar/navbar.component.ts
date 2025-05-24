import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { LayoutService } from '../shared/shared.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [IonHeader, IonToolbar, IonTitle]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isExpanded = false;
  private subscription!: Subscription;

  constructor(private layoutService: LayoutService) {}

  ngOnInit() {
    this.subscription = this.layoutService.sidebarState$.subscribe(
      state => this.isExpanded = state
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
