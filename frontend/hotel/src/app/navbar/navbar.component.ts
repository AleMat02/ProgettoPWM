import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonBreadcrumb, IonBreadcrumbs, IonLabel } from '@ionic/angular/standalone';
import { Observable, Subscription } from 'rxjs';
import { LayoutService } from '../shared/shared.service';
import { Breadcrumb, NavbarService } from './navbar.service';
import { RouterModule } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [IonLabel, 
    CommonModule,
    RouterModule, // Aggiungi RouterModule
    IonHeader,
    IonToolbar,
    IonBreadcrumbs,
    IonBreadcrumb,
    AsyncPipe
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isExpanded = false;
  private subscription!: Subscription;

  title$: Observable<string>;
  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(private layoutService: LayoutService, private navbarService: NavbarService) {
    this.title$ = this.navbarService.currentTitle$;
    this.breadcrumbs$ = this.navbarService.currentBreadcrumbs$;
  }

  ngOnInit() {
    this.subscription = this.layoutService.sidebarState$.subscribe(
      state => this.isExpanded = state
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
