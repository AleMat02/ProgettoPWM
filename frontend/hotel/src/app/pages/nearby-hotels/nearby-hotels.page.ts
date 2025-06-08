import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { map, tileLayer, icon, Marker, CircleMarker } from 'leaflet';
import { NearbyHotelsService } from 'src/app/services/nearby-hotels.service';


var zoom = 10;
@Component({
  selector: 'app-map',
  templateUrl: './nearby-hotels.page.html',
  styleUrls: ['./nearby-hotels.page.scss'],
  imports: [IonCard, IonContent, CommonModule, FormsModule, IonCardContent],
  standalone: true,
})
export class NearbyHotelsPage implements OnInit {

  title = "MAPPA SERVIZI";
  map: any;
  flag = false;
  value: number = 0;

  markerOptions = {
    title: "MyLocation",
    clickable: true,
    draggable: true
  };

  circleOptions = {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 10 * zoom
  };

  marker = new Marker([38.11563326486042, 13.361414037625677], this.markerOptions);
  circle = new CircleMarker([0, 0], this.circleOptions);

  lista: any[] = [];
  lista_new: any[] = [];

  markerIcon = icon({
    iconUrl: 'assets/pin.svg',
    iconSize: [32, 32],
  });

  constructor(private nearbyHotelsService: NearbyHotelsService) {
    this.marker.setTooltipContent("Edificio 6");
    this.marker.bindPopup("<a href='https://www.google.com'>link</a>");
  }

  ngOnInit() {
    this.nearbyHotelsService.getCurrentPosition().then((position: GeolocationPosition) => {
      this.marker.setLatLng([position.coords.latitude, position.coords.longitude]);
      this.circle.setLatLng([position.coords.latitude, position.coords.longitude]);
      this.circle.setRadius(10 * zoom);
      this.lista_new = this.convert(this.nearbyHotelsService.getNearbyHotels());
      console.log(this.lista_new);
    });
  }

  ionViewDidEnter() {
    this.initMap();
  }

  convert(obj: any): any {
    return Object.keys(obj).map(key => ({
      value: obj[key],
    }));
  }

  ionViewWillLeave() {
    this.map.remove();
  }

  initMap() {
    this.map = map('map').setView(this.marker.getLatLng(), zoom);
    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.lista_new.forEach((element: any) => {
      var el = new Marker([element.value.lat, element.value.long], this.markerOptions);
      el.bindPopup(
        `<div>Servizio: ${element.value.Tipologia}</div>` +
        `<div>Telefono: ${element.value.Telefono}</div>` +
        `<div>OrariSer: ${element.value.OrariSer}</div>` +
        "<a href=" + element.value.Web + "> Web: </a>"
      );
      var lat1 = Number(this.marker.getLatLng().lat) / 57.29577951;
      var long1 = Number(this.marker.getLatLng().lng) / 57.29577951;
      var lat2 = element.value.lat / 57.29577951;
      var long2 = element.value.long / 57.29577951;
      var d = 3963.0 * Math.acos((Math.sin(lat1) * Math.sin(lat2)) + Math.cos(lat1) * Math.cos(lat2) * Math.cos((long2 - long1)));
      d = d * 1.609344; // miglia a km
      el.addTo(this.map);
    });
  }



}