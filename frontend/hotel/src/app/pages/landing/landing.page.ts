import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { IonContent, IonTitle, IonButton, IonText, IonGrid, IonRow, IonCol, IonCard, IonCardTitle, IonCardContent, IonCardHeader } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: true,
  imports: [IonCardHeader, IonCardContent, IonCardTitle, IonCard, IonCol, IonRow, IonGrid, IonContent, IonTitle, IonText, CommonModule, NgOptimizedImage, IonButton, RouterModule] //Angular raccomanda di utilizzare NgOptimizedImage per gestire le immagini al meglio
})
export class LandingPage {
  constructor() { }

}