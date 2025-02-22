import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { MbscEventcalendarView, MbscPageChangeEvent, localeEs } from '@mobiscroll/angular';

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

  myView: MbscEventcalendarView = {
    calendar: { type: 'week' },
    agenda: { type: 'day' }
  };
  pickerLocale = localeEs;
  theme!: string;
  themeVariant: any;
  eventosHorario: any;
  fechaHorario: any = moment('09032020', 'DDMMYYYY').toDate();
  cargandoClases = false;

  constructor(private router: Router,
    private api: AlumnoService,
    private error: ErrorHandlerService,
    private mensaje: MensajeService,
    private profile: ProfileService,
    private global: AppGlobal,
    private snackbar: SnackbarService,
    private nav: NavController,
    private auth: AuthService,
    private pt: Platform) {
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

    this.theme = this.pt.is('ios') ? 'ios' : 'material';
    this.themeVariant = this.profile.isDarkMode() ? 'dark' : 'light';

    await this.cargar();
    await this.cargarHorario();
    this.api.marcarVista(VISTAS_ALUMNO.DETALLE_CURSO);
  }
  async cargar() {
    try {
      let params = await this.parametros();
      let result = await this.api.getSeccionV5(params.matrNcorr, params.seccCcod, params.ssecNcorr, params.periCcod);

      if (result.success) {
        let seccion = result.data;

        if (seccion.notas.length) {
          let evaluaciones = seccion.notas.filter((t: any) => {
            let fecha = moment(t.caliFevaluacion, 'DD/MM/YYYY');
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
    const fechaLunes = moment(this.fechaHorario).clone().startOf('week');
    const fechaInicio = fechaLunes.clone().startOf('week').format('DD/MM/YYYY');
    const fechaTermino = fechaLunes.clone().add(5, 'day').format('DD/MM/YYYY');

    this.cargandoClases = true;

    try {
      let params = await this.parametros();
      let result = await this.api.getHorarioSeccion(params.sedeCcod, params.periCcod, params.ssecNcorr, fechaInicio, fechaTermino);

      if (result.success) {
        this.procesarHorario(result.data.clases);
      }
      else {
        throw Error();
      }
    }
    catch {
      this.eventosHorario = undefined;
    }
    finally {
      this.cargandoClases = false;
    }
  }
  async onHorarioChange(args: MbscPageChangeEvent) {
    this.fechaHorario = moment(args.firstDay);
    this.cargarHorario();
  }
  procesarHorario(clases: any) {
    const fechaLunes = moment(this.fechaHorario).clone().startOf('week');
    let dias = this.groupBy(clases, 'diasCcod');
    let eventos = [];

    for (let dia in dias) {
      let fecha = fechaLunes.clone().add(Number(dia) - 1, 'day');
      let secciones = dias[dia];
      let inicio = secciones[0];
      let termino = secciones[secciones.length - 1];
      let cssClass = '';

      if (inicio.estadoBloque == 1) cssClass = 'suspendida';
      if (inicio.estadoBloque == 2 || inicio.estadoBloque == 4) cssClass = 'progreso';
      if (inicio.estadoBloque == 3) cssClass = 'realizada';

      eventos.push({
        title: inicio['asigTdesc'] + ' - <b>' + inicio['asigCcod'] + '</b><br/>Sala : ' + inicio['salaEjecucion'],
        start: moment(`${fecha.format('DD/MM/YYYY')} ${inicio.horaHinicio}`, 'DD/MM/YYYY HH:mi').toDate(),
        end: moment(`${fecha.format('DD/MM/YYYY')} ${termino.horaHtermino}`, 'DD/MM/YYYY HH:mi').toDate(),
        cssClass: cssClass,
        data: inicio
      })
    }

    this.eventosHorario = eventos;
  }
  async correo(persTemail: string) {
    try {
      await this.mensaje.crear(persTemail);
    }
    catch (error: any) {
      this.snackbar.showToast(error, 2000, 'danger');
    }
  }
  async mostrarEvaluaciones() {
    await this.nav.navigateForward(`${this.router.url}/evaluaciones`, { state: this.data });
  }
  async mostrarAsistencia() {
    let params = await this.parametros();
    await this.nav.navigateForward(`${this.router.url}/asistencia`, { state: params });
  }
  async mostrarAlumnos() {
    let params = await this.parametros();
    await this.nav.navigateForward(`${this.router.url}/estudiantes`, { state: params });
  }
  async mostrarBibliografia() {
    let params = await this.parametros();
    await this.nav.navigateForward(`${this.router.url}/bibliografia`, { state: params });
  }
  resolverFechaEvaluacion(caliFevaluacion: string) {
    return moment(caliFevaluacion, 'DD/MM/YYYY').locale('es').format('<b>DD</b> MMM').replace('.', '');
  }
  resolverNotaRojo(nota: string) {
    if (!nota)
      return 'gris';
    if (parseInt(nota) < 4) {
      return 'rojo';
    }
    return '';
  }
  resolverFoto(persNcorr: any) {
    return `${this.global.Api}/api/v3/imagen-persona/${persNcorr}`;
  }
  groupBy(xs: any[], key: string) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }
  async parametros() {
    let principal = await this.profile.getStorage('principal');
    let programa = principal.programas[principal.programaIndex];
    let periodos = principal.periodos as any[];
    let seccCcod = this.seccion.seccCcod;
    let asignaturas = programa.asignaturas as any[];
    let seccion = asignaturas.find(item => item.seccCcod == seccCcod);
    let periodo = periodos.find(item => item.periSeleccionado == true);

    return {
      asigCcod: seccion.asigCcod,
      asigTdesc: seccion.asigTdesc,
      seccCcod: seccCcod,
      ssecNcorr: seccion.ssecNcorr,
      matrNcorr: programa.matrNcorr,
      periCcod: periodo.periCcod,
      sedeCcod: programa.sedeCcod
    };
  }
  get colorAzul() {
    if (document.body.classList.contains('dark')) {
      return "#508DFD";
    }
    else {
      return "#1565C0";
    }
  }
  get colorGris() {
    if (document.body.classList.contains('dark')) {
      return "#666";
    }
    else {
      return "#eee";
    }
  }
  get backUrl() {
    return this.router.url.startsWith('/alumno/cursos') ? '/alumno/cursos' : '/alumno/inicio';
  }
  get backText() {
    return this.router.url.startsWith('/alumno/cursos') ? 'Cursos' : 'Inicio';
  }

}


