import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private sidebarState = new BehaviorSubject<boolean>(false); // Inizializza con lo stato collassato (false)

  sidebarState$ = this.sidebarState.asObservable();

  setSidebarState(isExpanded: boolean) {
    this.sidebarState.next(isExpanded);
  }

  toggleSidebar() {
    this.sidebarState.next(!this.sidebarState.value);
  }
}