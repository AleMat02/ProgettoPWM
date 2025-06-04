import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SidebarService {
    private sidebarState = new BehaviorSubject<boolean>(false); // Inizializza con lo stato collassato (false)
    sidebarState$ = this.sidebarState.asObservable();

    constructor(private http: HttpClient) { }

    setSidebarState(isExpanded: boolean) {
        this.sidebarState.next(isExpanded);
    }

    toggleSidebar() {
        this.sidebarState.next(!this.sidebarState.value);
    }
}