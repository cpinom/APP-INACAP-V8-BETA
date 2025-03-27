import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import * as moment from 'moment';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { IonAccordionGroup, NavController, Platform } from '@ionic/angular';
import { EventsService } from 'src/app/core/services/events.service';
import { AppEvent } from 'src/app/core/interfaces/auth.interfaces';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/core/services/profile.service';
import { AutoAsistenciaService } from 'src/app/core/services/auto-asistencia.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit, OnDestroy {

  @ViewChild('acordeones', { static: false }) acordeones!: IonAccordionGroup;
  mostrarCargando = true;
  seccion: any;
  data: any;
  detalleAsistencia: any;
  asistencia: any;
  asistenciaCC: any;
  mostrarData = false;
  tabModel = 0;
  asistenciaObs: Subscription;
  mesModel = '';

  private api = inject(AlumnoService);
  private router = inject(Router);
  private error = inject(ErrorHandlerService);
  private nav = inject(NavController);
  private events = inject(EventsService);
  private profile = inject(ProfileService);
  private pt = inject(Platform);
  private autoAsistencia = inject(AutoAsistenciaService);

  constructor() {

    this.asistenciaObs = this.events.app.subscribe((event: AppEvent) => {
      if (event.action == 'app:registro-asistencia-campos-clinicos') {
        this.cargar();
      }
    });

  }
  async ngOnInit() {
    this.seccion = this.router.getCurrentNavigation()?.extras.state;
    console.log(this.seccion);
    this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.ASISTENCIA);
  }
  ngOnDestroy() {
    this.asistenciaObs.unsubscribe();
  }
  async cargar() {
    try {
      const programa = await this.profile.getPrograma();
      const { matrNcorr } = programa;
      const { seccCcod, ssecNcorr, periCcod } = this.seccion;
      const result = await this.api.getAsistenciaV6(matrNcorr, seccCcod, ssecNcorr, periCcod);

      if (result.success) {
        this.procesarAsistenciaV2(result.data.asistencia);
        this.asistenciaCC = result.data.asistenciaCC;
      }

      // if (result.success) {
      //   // debugger
      //   this.detalleAsistencia = result.data;
      //   this.procesarAsistencia();
      // }
      // else {
      //   throw Error();
      // }

      //const { seccCcod, ssecNcorr, periCcod } = this.seccion;

      // let result = await this.api.getAsistencia(this.seccion.seccCcod, this.seccion.ssecNcorr, this.seccion.periCcod);

      // if (result.success) {
      //   this.detalleAsistencia = result.data;
      //   this.procesarAsistenciaV2();
      //   // this.procesarAsistencia();
      // }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
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
  procesarAsistenciaV2(listado: any[]) {
    const meses: string[] = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // quitar hora para comparar solo fechas

    const grupos = new Map<string, any[]>();

    for (const clase of listado) {
      const [dia, mes, anioCorto] = clase.fecha.split('/');
      const anio = +anioCorto < 50 ? 2000 + +anioCorto : 1900 + +anioCorto; // ← Aquí corregimos el año

      const fecha = new Date(anio, +mes - 1, +dia);
      fecha.setHours(0, 0, 0, 0);

      const clave = `${anio}-${mes.padStart(2, '0')}`; // ej: "2025-03"

      if (!grupos.has(clave)) grupos.set(clave, []);
      grupos.get(clave)!.push(clase);
    }

    const resultados: any[] = [];

    for (const [clave, clasesMes] of grupos) {
      const [anioStr, mesStr] = clave.split('-');
      const anio = parseInt(anioStr, 10);
      const mesIndex = parseInt(mesStr, 10) - 1;

      const inicioMes = new Date(anio, mesIndex, 1);
      const finMes = new Date(anio, mesIndex + 1, 0);
      inicioMes.setHours(0, 0, 0, 0);
      finMes.setHours(0, 0, 0, 0);

      let resumen = '';
      let detalle = [...clasesMes];

      if (finMes < hoy) {
        // Mes pasado
        const asistidas = clasesMes.filter(c => c.title === 'Presente').length;
        resumen = `${asistidas}/${clasesMes.length} clases asistidas`;
      }
      else if (inicioMes > hoy) {
        // Mes futuro
        resumen = `${clasesMes.length} clases por realizar`;
      }
      else {
        // Mes actual
        const clasesRealizadas = clasesMes.filter(clase => {
          const [d, m, aCorto] = clase.fecha.split('/');
          const a = +aCorto < 50 ? 2000 + +aCorto : 1900 + +aCorto;
          const fechaClase = new Date(a, +m - 1, +d);
          fechaClase.setHours(0, 0, 0, 0);
          return fechaClase <= hoy;
        });

        const asistidas = clasesRealizadas.filter(c => c.title === 'Presente').length;
        resumen = `${asistidas}/${clasesRealizadas.length} clases asistidas`;
      }

      const esMesActual = (mesIndex === hoy.getMonth() && anio === hoy.getFullYear());

      resultados.push({
        mes: `${meses[mesIndex][0].toUpperCase()}${meses[mesIndex].slice(1)}`,
        resumen,
        detalle,
        actual: esMesActual
      });
    }

    this.mesModel = resultados.find(m => m.actual)?.mes || '';
    this.asistencia = resultados;

    setTimeout(() => {
      if (this.acordeones) {
        this.acordeones.value = this.mesModel;
      }
    }, 250);
  }
  // procesarAsistencia() {
  //   let proximas: any[] = [];
  //   let semanales: any[] = [];
  //   let mensuales: any[] = [];
  //   let antiguas: any[] = [];

  //   this.listado.forEach((item: any) => {
  //     let fechaAsistencia = moment(item.fecha, 'DD/MM/YYYY');
  //     let primerDiaSemana = moment().startOf('isoweek' as moment.unitOfTime.StartOf);
  //     let primerDiaMes = moment().startOf('month');

  //     if (fechaAsistencia.isSameOrBefore(moment())) {

  //       if (fechaAsistencia.isSameOrAfter(primerDiaSemana)) {
  //         semanales.push(item);
  //       }
  //       else if (fechaAsistencia.isSameOrAfter(primerDiaMes)) {
  //         mensuales.push(item);
  //       }
  //       else {
  //         antiguas.push(item);
  //       }

  //     }
  //     else {
  //       proximas.push(item);
  //     }
  //   });

  //   this.asistencia = {};
  //   this.asistencia[0] = this.resolverOrden(semanales);
  //   this.asistencia[1] = this.resolverOrden(mensuales);
  //   this.asistencia[2] = this.resolverOrden(antiguas);
  //   this.asistencia[3] = this.resolverOrden(proximas);
  //   this.mostrarData = true;
  // }
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
    const { matrNcorr, apcvNcorr } = data;
    const { ssecNcorr } = this.seccion;
    const apesNasistencia = 1; //Asistencia del estudiante 0 ausente 1 presente
    const apesNvalidaasistencia = 2; //Valida asistencia del estudiante al centro 0 sin asistencia 1 valida estudiante 2 valida estudiante con foto 3 valida docente
    const apesTlatitud = '';
    const apesTlongitud = '';
    const params = { ...{}, ssecNcorr, matrNcorr, apcvNcorr, apesNasistencia, apesNvalidaasistencia, apesTlatitud, apesTlongitud };

    const result = await this.autoAsistencia.mostrarModal(params);
    debugger
    if (result) {
      this.asistenciaCC = result
    }
  }
  esHoy(fechaString: string) {
    return true;
    if (this.pt.is('mobileweb')) return true;
    return fechaString ? moment(fechaString, 'DD/MM/YYYY').isSame(moment(), 'day') : false;
  }
  // get listado() {
  //   return this.detalleAsistencia ? this.detalleAsistencia.detalle : [];
  // }
  // get listado() {
  //   return this.detalleAsistencia ? this.detalleAsistencia.asistencia : [];
  // }
  get mostrarAutoAsistencia() {
    if (this.seccion) {
      return this.seccion.tsseCcod == 3;
    }
    return false;
  }
  get asignatura() {
    return this.seccion ? this.seccion.asigTdesc : '';
  }
  get backUrl() {
    return this.router.url.replace('/asistencia', '');
  }
}
