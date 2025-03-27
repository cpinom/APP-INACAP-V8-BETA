import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { NavController, Platform } from '@ionic/angular';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { ProfileService } from 'src/app/core/services/profile.service';
import { AppGlobal } from 'src/app/app.global';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AuthService } from 'src/app/core/services/auth.service';
import 'jquery-knob';
import * as desconocido from 'src/scripts/foto.desconocido';
import * as moment from 'moment';

@Component({
  selector: 'app-seccion',
  templateUrl: './seccion.page.html',
  styleUrls: ['./seccion.page.scss'],
})
export class SeccionPage implements OnInit, OnDestroy {

  seccion: any;
  data: any;
  objectKeys = Object.keys;
  hasRiesgo = false;
  fotoDesconocido = desconocido.imgBase64;
  evaluacion: any;
  mostrarCargando = true;
  mostrarData = false;
  userId!: number;
  eventos: any;
  fechaHorario: any = moment().toDate();
  cargandoClases = false;

  private router = inject(Router);
  private api = inject(AlumnoService);
  private error = inject(ErrorHandlerService);
  private mensaje = inject(MensajeService);
  private profile = inject(ProfileService);
  private global = inject(AppGlobal);
  private snackbar = inject(SnackbarService);
  private nav = inject(NavController);
  private auth = inject(AuthService);
  private pt = inject(Platform);

  constructor() {
    moment.locale('es');

    this.seccion = this.router.getCurrentNavigation()?.extras.state;
    this.auth.getAuth().then(auth => {
      this.userId = auth.user.data.persNcorr;
    });

    if (this.pt.is('capacitor')) {
      this.fechaHorario = moment().toDate();
    }
  }
  ngOnDestroy() { }
  async ngOnInit() {
    if (!this.seccion) {
      this.nav.navigateBack(this.backUrl);
      return;
    }

    await this.cargar();
    await this.cargarHorario();
    this.api.marcarVista(VISTAS_ALUMNO.DETALLE_CURSO);
  }
  async cargar() {
    try {
      const { matrNcorr, seccCcod, ssecNcorr, periCcod } = await this.parametros();
      const result = await this.api.getSeccionV5(matrNcorr, seccCcod, ssecNcorr, periCcod);

      if (result.success) {
        const seccion = result.data;

        if (seccion.notas.length) {
          const evaluaciones = seccion.notas.filter((t: any) => {
            const fecha = moment(t.caliFevaluacion, 'DD/MM/YYYY');

            if (fecha.isAfter(moment())) {
              return true;
            }

            return false
          });

          if (evaluaciones.length) {
            this.evaluacion = evaluaciones[0];
          }
          else {
            this.evaluacion = seccion.notas[seccion.notas.length - 1]
          }
        }

        this.data = seccion;
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
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;

    await this.cargar();
    await this.cargarHorario();
  }
  async cargarHorario() {
    const fechaInicio = moment(this.fechaHorario).format('DD/MM/YYYY');
    const fechaTermino = fechaInicio;

    this.cargandoClases = true;

    try {
      const { sedeCcod, periCcod, seccCcod } = await this.parametros();
      const result = await this.api.getAgendaSeccion(sedeCcod, periCcod, seccCcod, fechaInicio, fechaTermino);

      if (result.success) {
        this.eventos = result.data.eventos;
      }
      else {
        throw Error();
      }
    }
    catch {
      this.eventos = undefined;
    }
    finally {
      this.cargandoClases = false;
    }
  }
  resolverFechaAgenda(index: number) {
    if (index == 0) {
      const agendaDia = moment(this.fechaHorario).format('dddd')
      return agendaDia.charAt(0).toUpperCase() + agendaDia.slice(1);
    }
    else if (index == 1) {
      const agendaFecha = moment(this.fechaHorario).format('D MMM');
      return agendaFecha;
    }

    return '';
  }
  resolverIconoAgenda(item: any, type: number) {
    if (type == 0) {
      if (item.bloqTipo == 'evaluacion')
        return 'notas';
      if (item.bloqTipo == 'seccion')
        return 'school';
      if (item.bloqTipo == 'recuperacion')
        return 'schedule';
    }
    else if (type == 1) {
      if (item.bloqTipo == 'evaluacion')
        return 'variant-4';
      if (item.bloqTipo == 'seccion')
        return 'variant-3';
      if (item.bloqTipo == 'recuperacion')
        return 'variant-5';
    }

    return '';
  }
  resolverTipoAgenda(item: any) {
    if (item.bloqTipo == 'evaluacion')
      return `Evaluación - ${item.asigTdesc}`;
    if (item.bloqTipo == 'seccion')
      return `Clases - ${item.asigTdesc}`;
    return item.asigTdesc;
  }
  async correoTap(persTemail: string) {
    try {
      await this.mensaje.crear(persTemail);
    }
    catch (error: any) {
      this.snackbar.showToast(error, 2000, 'danger');
    }
  }
  async evaluacionesTap() {
    await this.nav.navigateForward(`${this.router.url}/evaluaciones`, { state: this.data });
  }
  async asistenciaTap() {
    const params = await this.parametros();
    const { tsseCcod } = this.data.seccion;
    await this.nav.navigateForward(`${this.router.url}/asistencia`, { state: { ...params, tsseCcod: tsseCcod } });
  }
  async alumnosTap() {
    let params = await this.parametros();
    await this.nav.navigateForward(`${this.router.url}/estudiantes`, { state: params });
  }
  async bibliografiaTap() {
    let params = await this.parametros();
    await this.nav.navigateForward(`${this.router.url}/bibliografia`, { state: params });
  }
  async tutorIATap() {
    await this.nav.navigateForward(`${this.router.url}/tutor-ia`, { state: this.seccion });
  }
  resolverFechaEvaluacion(caliFevaluacion: string) {
    return moment(caliFevaluacion, "DD/MM/YYYY").format("DD MMM");
  }
  resolverEvaluacionesRealizadas() {
    if (this.data.notas.length) {
      const totalEvaluaciones = this.data.notas.length;
      const evaluacionesRealizadas = this.data.notas.filter((evaluacion: any) => evaluacion.calaNnota !== null).length;
      return `${evaluacionesRealizadas} de ${totalEvaluaciones} eval. realizadas`;
    }

    return '';
  }
  resolverFoto(persNcorr: any) {
    return `${this.global.Api}/api/v3/imagen-persona/${persNcorr}`;
  }
  async parametros() {
    const principal = await this.profile.getStorage('principal');
    const programa = principal.programas[principal.programaIndex];
    const periodos = principal.periodos as any[];
    const { seccCcod, ssecNcorr } = this.seccion;
    const asignaturas = programa.asignaturas as any[];
    const seccion = asignaturas.find(item => item.seccCcod == seccCcod);
    const periodo = periodos.find(item => item.periSeleccionado == true);

    return {
      asigCcod: seccion.asigCcod,
      asigTdesc: seccion.asigTdesc,
      seccCcod: seccCcod,
      ssecNcorr: ssecNcorr,
      matrNcorr: programa.matrNcorr,
      periCcod: periodo.periCcod,
      sedeCcod: programa.sedeCcod
    };
  }
  get backUrl() {
    return this.router.url.startsWith('/dashboard-alumno/cursos') ? '/dashboard-alumno/cursos' : '/dashboard-alumno/inicio';
  }
  get backText() {
    return this.router.url.startsWith('/dashboard-alumno/cursos') ? 'Cursos' : 'Inicio';
  }

}


