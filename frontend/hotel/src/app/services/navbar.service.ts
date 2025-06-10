import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface Breadcrumb { //* spostare nel file apposito
    label: string;
    url: string;
}

@Injectable({
    providedIn: 'root'
})
export class NavbarService {
    private titleSource = new BehaviorSubject<string>('Dashboard');
    private breadcrumbsSource = new BehaviorSubject<Breadcrumb[]>([]);

    currentTitle$ = this.titleSource.asObservable();
    currentBreadcrumbs$ = this.breadcrumbsSource.asObservable();

    constructor() { }

    setBreadcrumbs(breadcrumbs: Breadcrumb[]) {
        this.breadcrumbsSource.next(breadcrumbs);
    }
}