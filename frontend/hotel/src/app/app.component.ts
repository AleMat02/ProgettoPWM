import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { Subscription } from 'rxjs';
import { LayoutService } from './shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, SidebarComponent, NavbarComponent],
})
export class AppComponent implements OnInit, OnDestroy {
  isSidebarExpanded = false;
  private sub!: Subscription;

  constructor(private layout: LayoutService) {}

  ngOnInit() {
    this.sub = this.layout.sidebarState$.subscribe(
      state => (this.isSidebarExpanded = state)
    );
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
