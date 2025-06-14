import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonLabel } from '@ionic/angular/standalone';
import { Observable, Subscription } from 'rxjs';
import { NavbarService } from '../../services/navbar.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [ 
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isExpanded = false;
  private sidebarSub!: Subscription;

  // title$: Observable<string>;

  constructor(private sidebarService: SidebarService, private navbarService: NavbarService) {
    // this.title$ = this.navbarService.currentTitle$;
      // console.log(this.title$)
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
