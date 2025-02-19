import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import * as moment from 'moment';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { NavController } from '@ionic/angular';
import { EventsService } from 'src/app/core/services/events.service';
import { AppEvent } from 'src/app/core/interfaces/auth.interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit, OnDestroy {

  mostrarCargando = true;
  seccion: any;
  data: any;
  detalleAsistencia: any;
  asistencia: any;
  mostrarData = false;
  tabModel = 0;
  asistenciaObs: Subscription;

  constructor(private api: AlumnoService,
    private router: Router,
    private error: ErrorHandlerService,
    private nav: NavController,
    private events: EventsService) {

    this.asistenciaObs = this.events.app.subscribe((event: AppEvent) => {
      if (event.action == 'app:registro-asistencia-campos-clinicos') {
        this.cargar();
      }
    });

  }
  async ngOnInit() {
    this.seccion = this.router.getCurrentNavigation()?.extras.state;
    this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.ASISTENCIA);
  }
  ngOnDestroy() {
    this.asistenciaObs.unsubscribe();
  }
  async cargar() {
    try {
      // let result = await this.api.getAsistenciaV6(this.seccion.matrNcorr, this.seccion.seccCcod, this.seccion.ssecNcorr, this.seccion.periCcod);

      // if (result.success) {
      //   // debugger
      //   this.detalleAsistencia = result.data;
      //   this.procesarAsistencia();
      // }
      // else {
      //   throw Error();
      // }

      let result = await this.api.getAsistencia(this.seccion.seccCcod, this.seccion.ssecNcorr, this.seccion.periCcod);

      if (result.success) {
        this.detalleAsistencia = result.data;
        this.procesarAsistencia();
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        this.error.handle(error);
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  procesarAsistencia() {
    let proximas: any[] = [];
    let semanales: any[] = [];
    let mensuales: any[] = [];
    let antiguas: any[] = [];

    this.listado.forEach((item: any) => {
      let fechaAsistencia = moment(item.fecha, 'DD/MM/YYYY');
      let primerDiaSemana = moment().startOf('isoweek' as moment.unitOfTime.StartOf);
      let primerDiaMes = moment().startOf('month');

      if (fechaAsistencia.isSameOrBefore(moment())) {

        if (fechaAsistencia.isSameOrAfter(primerDiaSemana)) {
          semanales.push(item);
        }
        else if (fechaAsistencia.isSameOrAfter(primerDiaMes)) {
          mensuales.push(item);
        }
        else {
          antiguas.push(item);
        }

      }
      else {
        proximas.push(item);
      }
    });

    this.asistencia = {};
    this.asistencia[0] = this.resolverOrden(semanales);
    this.asistencia[1] = this.resolverOrden(mensuales);
    this.asistencia[2] = this.resolverOrden(antiguas);
    this.asistencia[3] = this.resolverOrden(proximas);
    this.mostrarData = true;
  }
  resolverIcon(estado: string) {
    if (estado.toUpperCase() == 'PRESENTE')
      return 'check_circle_outline';
    if (estado.toUpperCase() == 'AUSENTE')
      return 'highlight_off';
    return 'radio_button_unchecked';
  }
  resolverColor(estado: string) {
    if (estado.toUpperCase() == 'PRESENTE')
      return 'success';
    if (estado.toUpperCase() == 'AUSENTE')
      return 'danger';
    return 'medium';
  }
  resolverOrden(data: any[]) {
    return data.sort((a, b) => {
      let fechaA = moment(a.fecha, 'DD/MM/YYYY');
      let fechaB = moment(b.fecha, 'DD/MM/YYYY');

      return fechaA.isAfter(fechaB) ? -1 : 1;
    })
  }
  async registrarAsistencia(data: any) {
    await this.nav.navigateForward(`${this.backUrl}/auto-asistencia`, { state: data })
    // await this.nav.navigateForward(`${this.router.url}/evaluaciones`, { state: data });
  }
  get listado() {
    return this.detalleAsistencia ? this.detalleAsistencia.detalle : [];
  }
  // get listado() {
  //   return this.detalleAsistencia ? this.detalleAsistencia.asistencia : [];
  // }
  get asignatura() {
    return this.seccion ? this.seccion.asigTdesc : '';
  }
  get backUrl() {
    return this.router.url.replace('/asistencia', '');
  }
}
