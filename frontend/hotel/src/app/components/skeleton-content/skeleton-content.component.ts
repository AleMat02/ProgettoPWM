import { Component } from '@angular/core';
import { IonCard, IonCardHeader, IonCardContent, IonSkeletonText, IonList } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-skeleton-content',
    templateUrl: './skeleton-content.component.html',
    styleUrls: ['./skeleton-content.component.scss'],
    imports: [IonCard, IonCardHeader, IonCardContent, IonSkeletonText, IonList, CommonModule]
})
export class SkeletonContentComponent { }
