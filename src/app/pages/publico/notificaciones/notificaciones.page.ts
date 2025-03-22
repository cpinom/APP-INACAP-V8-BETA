import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { NavController } from '@ionic/angular';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { VISTAS } from 'src/app/core/constants/publico';
import { AppEvent } from 'src/app/core/interfaces/auth.interfaces';
import { EventsService } from 'src/app/core/services/events.service';
import { PublicService } from 'src/app/core/services/http/public.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit, OnDestroy {

  private api = inject(PublicService);
  private router = inject(Router);
  private nav = inject(NavController);
  private events = inject(EventsService);

  mostrarData = false;
  mostrarError = false;
  mostrarCargando = true;
  mostrarEmpty = false;
  notificaciones: any = {};
  notificationsObs: Subscription;

  constructor() {

    this.notificationsObs = this.events.app.subscribe((event: AppEvent) => {
      debugger
      if (event.action == 'app:publico-notificaciones') {
        this.procesarNotificaciones(event.value);
      }
    });

  }
  ngOnDestroy() {
    this.notificationsObs.unsubscribe();
  }

  async ngOnInit() {
    await this.cargar();
    this.api.marcarVistaPublica(VISTAS.NOTIFICACIONES);
  }
  async cargar(e?: any) {
    try {
      const info = await Device.getId();
      const npreTuuid = info.identifier || 'web';
      const result = await this.api.getNotificaciones(npreTuuid);

      if (result.success) {
        this.procesarNotificaciones(result.notificaciones);
        this.mostrarData = true;
      }
      else {
        throw Error();
      }
    }
    catch (error) {
      this.mostrarError = true;
    }
    finally {
      this.mostrarCargando = false;
      e && e.target.complete();
    }
  }
  recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    this.mostrarError = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  procesarNotificaciones(data: any[]) {
    let nuevas: any = [];
    let semanales: any = [];
    let mensuales: any = [];
    let antiguas: any = [];

    data.forEach(item => {
      let fechaEnvio = moment(item.apnoFcreacion, 'DD/MM/YYYY HH:mm');
      let primerDiaSemana = moment().startOf('isoweek' as moment.unitOfTime.StartOf);
      let primerDiaMes = moment().startOf('month');
      let esHoy = fechaEnvio.isSame(new Date(), 'day');
      let esAyer = fechaEnvio.isSame(moment().subtract(1, 'day'), 'day');

      if (esHoy || esAyer) {
        nuevas.push(item);
      }
      else if (fechaEnvio.isSameOrAfter(primerDiaSemana)) {
        semanales.push(item);
      }
      else if (fechaEnvio.isSameOrAfter(primerDiaMes)) {
        mensuales.push(item);
      }
      else {
        antiguas.push(item);
      }
    });

    this.notificaciones = {};
    this.notificaciones[0] = nuevas;
    this.notificaciones[1] = semanales;
    this.notificaciones[2] = mensuales;
    this.notificaciones[3] = antiguas;
    this.mostrarEmpty = !nuevas.length && !semanales.length && !mensuales.length && !antiguas.length;
    this.mostrarData = true;
  }
  async eliminarNotificacion(data: any, e: Event) {
    e.stopPropagation();

    const info = await Device.getId();
    const npreTuuid = info.identifier || 'web';
    const params = {
      apnoNcorr: data.apnoNcorr,
      npreTuuid: npreTuuid,
      apnmNtipo: 2
    };

    data.disabled = true;

    try {
      const result = await this.api.guardarNotificacionMovimiento(params);

      if (result.success) {
        this.procesarNotificaciones(result.notificaciones);
        this.mostrarData = true;
      }
      else {
        throw Error();
      }
    }
    catch {
      data.disabled = false;
    }
  }
  abrirConfiguraciones() { }
  async detalleNotificacion(data: any) {
    await this.nav.navigateForward(this.router.url + '/detalle-notificacion', { state: data });
  }
  get backUrl() { return this.router.url.replace('/notificaciones', '') }

}
