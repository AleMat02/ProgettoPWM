import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-nearby-hotels',
  templateUrl: './nearby-hotels.page.html',
  styleUrls: ['./nearby-hotels.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class NearbyHotelsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
