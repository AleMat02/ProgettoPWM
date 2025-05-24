import { Component, OnInit } from '@angular/core';
import { IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [IonHeader, IonToolbar, IonTitle]
})
export class NavbarComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
