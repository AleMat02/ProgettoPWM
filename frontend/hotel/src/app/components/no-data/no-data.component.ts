import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-no-data',
    templateUrl: './no-data.component.html',
    styleUrls: ['./no-data.component.scss'],
    imports: [IonIcon, CommonModule],
})
export class NoDataComponent {
    @Input() icon: string = 'sad-outline';
    @Input() title: string = 'Nessun elemento trovato';
    @Input() subtitle: string = 'Inizia creandone uno.';
    @Input() isAdmin: boolean = false;
}
