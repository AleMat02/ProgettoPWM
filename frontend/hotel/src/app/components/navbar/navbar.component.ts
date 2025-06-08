import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonBreadcrumb, IonBreadcrumbs, IonLabel } from '@ionic/angular/standalone';
import { Observable, Subscription } from 'rxjs';
import { Breadcrumb, NavbarService } from '../../services/navbar.service';
import { RouterModule } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';

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
  private sidebarSub!: Subscription;

  title$: Observable<string>;
  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(private sidebarService: SidebarService, private navbarService: NavbarService) {
    this.title$ = this.navbarService.currentTitle$;
    this.breadcrumbs$ = this.navbarService.currentBreadcrumbs$;
  }

  ngOnInit() {
    this.sidebarSub = this.sidebarService.sidebarState$.subscribe(
      state => this.isExpanded = state
    );
  }

  ngOnDestroy() {
    this.sidebarSub.unsubscribe();
  }
}
