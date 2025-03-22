import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { AppGlobal } from 'src/app/app.global';
import { PublicService } from 'src/app/core/services/http/public.service';

enum Sedes {
  Cercanas = 0,
  Todas = 1
}

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.page.html',
  styleUrls: ['./sedes.page.scss'],
  standalone: false
})
export class SedesPage implements OnInit, OnDestroy {

  private api = inject(PublicService);
  private global = inject(AppGlobal);

  tabsModel = Sedes.Cercanas;
  cercanas: any;
  online: any;
  sedes: any;
  sedesFiltradas: any;
  sedesFiltro = '';
  mostrarCargando = true;
  mostrarCercanas = false;
  mostrarSedes = false;
  zonas: any;

  constructor() { }
  ngOnDestroy() { }
  async ngOnInit() {
    await this.cargar();
  }
  segmentChanged(ev: any) {
  }
  async cargar(forzar?: boolean) {
    let zonas = await this.api.getStorage('zonas');

    if (!zonas || forzar) {
      try {
        let response = await this.api.getZonas();

        if (response.success) {
          zonas = response.zonas;
        }
      }
      catch (error) { }
    }

    if (zonas) {
      this.zonas = zonas;
      this.procesarSedes();
      this.resolverOnline();
      this.cercanas = await this.getSedesCercanas();
      await this.api.setStorage('zonas', zonas);
    }

    this.mostrarSedes = true;
    this.mostrarCargando = false;
  }
  procesarSedes() {
    this.sedes = [];
    this.zonas.forEach((zona: any) => {
      zona.sedes.forEach((sede: any) => {
        this.sedes.push(sede);
      });
    });
  }
  async getSedesCercanas() {
    const position = await this.getCurrentPosition();

    if (position) {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const sedesConDistancia = this.sedes.map((sede: any) => {
        if (sede.sedeCcod != 47) {
          const distancia = this.getDistanceFromLatLonInKm(userLat, userLng, sede.sedeTlatitud, sede.sedeTlongitud);
          const km = `${distancia.toFixed(1)} km`;
          const sedeBarchivo = `${this.global.Api}/api/v3/imagen-sede/${sede.sedeCcod}`;
          return { ...sede, distancia, km, sedeBarchivo };
        }
      });

      // Ordenar por distancia y obtener las 5 más cercanas
      const sedesOrdenadas = sedesConDistancia.sort((a: any, b: any) => (a.distancia ?? 0) - (b.distancia ?? 0));
      return sedesOrdenadas.slice(0, 5);
    }
  }
  resolverCercanas(position: any) {
    // let latitude = position.coords.latitude;
    // let longitude = position.coords.longitude;
    // let currentPosition = new geometry.LatLng(latitude, longitude);
    // let distances :any[]= [];

    // this.sedes.forEach(sede => {
    //   if (sede.sedeCcod != 47) {
    //     let sedePosition = new geometry.LatLng(sede.sedeTlatitud, sede.sedeTlongitud);
    //     let distancia = geometry.computeDistanceBetween(currentPosition, sedePosition);

    //     distances.push({
    //       result: distancia,
    //       data: sede,
    //       id: sede.sedeCcod
    //     });
    //   }
    // });

    // distances.sort((obj1, obj2) => {
    //   if (obj1.result < obj2.result) return -1;
    //   else if (obj1.result > obj2.result) return 1;
    //   else return 0;
    // });

    // const cercanas = distances.slice(0, 3).map((element, i) => {
    //   element.data['km'] = (element.result / 1000).toFixed(1) + ' km';
    //   element.data['sedeBarchivo'] = `${this.global.Api}/api/v3/imagen-sede/${element.id}`;

    //   return element.data;
    // });

    // return cercanas;
  }
  resolverOnline() {
    let online = this.sedes.find((t: any) => t.sedeCcod == 47);

    if (online) {
      online['sedeBarchivo'] = `${this.global.Api}/api/v3/imagen-sede/47`;
      this.online = online;
    }
  }
  recargar(e: any) {
    this.mostrarSedes = false;
    this.sedesFiltro = '';
    this.cargar(true).finally(() => {
      e.target.complete();
    })
  }
  async getCurrentPosition() {
    let position = null;

    try {
      position = await Geolocation.getCurrentPosition();
    } catch { }

    return position;
  }
  filtrarSedes() {
    this.sedesFiltradas = this.sedes.filter((element: any) => {
      return element.sedeTdesc.toLowerCase().indexOf(this.sedesFiltro.toLowerCase()) > -1;
    });
  }
  resetSedes() {
    this.sedesFiltro = '';
    this.sedesFiltradas = this.sedes;
  }
  getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

}
