import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private sidebarState = new Subject<boolean>();
  sidebarState$ = this.sidebarState.asObservable();

  setSidebarState(isExpanded: boolean) {
    this.sidebarState.next(isExpanded);
  }
}