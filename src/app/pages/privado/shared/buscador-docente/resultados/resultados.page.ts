import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { MbscCalendarEvent, MbscEventClickEvent, MbscEventcalendarView, MbscPageChangeEvent, localeEs } from '@mobiscroll/angular';
import * as moment from 'moment';
import { AppGlobal } from 'src/app/app.global';
import { BuscadorDocentesService } from 'src/app/core/services/http/buscador-docentes.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import * as desconocido from 'src/scripts/foto.desconocido';

enum Vistas {
  asignatura = '0',
  docente = '1',
  sala = '2'
};

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
})
export class ResultadosPage implements OnInit {

  mostrarDocente = false;
  mostrarSala = false;
  mostrarCargando = true;
  docentes!: any[];
  horario: any;
  nombreSala!: string;
  planificacion: any;
  fotoDesconocido = desconocido.imgBase64;
  data: any;
  cargandoSala = false;
  salaEventos: MbscCalendarEvent[] = [];
  myView: MbscEventcalendarView = {
    calendar: { type: 'week' },
    agenda: { type: 'day' },
  };
  pickerLocale = localeEs;
  salaFecha: any;
  theme: string;
  themeVariant: any;

  private api = inject(BuscadorDocentesService);
  private mensaje = inject(MensajeService);
  private error = inject(ErrorHandlerService);
  private global = inject(AppGlobal);
  private snackbar = inject(SnackbarService);
  private pt = inject(Platform);
  private router = inject(Router);
  private nav = inject(NavController);
  private cdRef = inject(ChangeDetectorRef);
  private profile = inject(ProfileService);

  constructor() {

    this.data = this.router.getCurrentNavigation()?.extras.state;
    this.theme = this.pt.is('ios') ? 'ios' : 'material';
    this.themeVariant = this.profile.isDarkMode() ? 'dark' : 'light';

    screen.orientation.addEventListener("change", () => {
      if (this.oppositeOrientation == 'portrait') {
        this.myView = { schedule: { type: 'week', allDay: false } };
      }
      else {
        this.myView = {
          calendar: { type: 'week' },
          agenda: { type: 'day' },
        }
      }
    });
  }
  async ngOnInit() {
    if (!this.data) {
      await this.nav.navigateBack(this.backUrl);
      return;
    }
    console.log(this.data);
    await this.cargar();
  }
  async cargar() {
    try {
      switch (this.data.tipo) {
        case Vistas.asignatura: {
          const { sedeCcod, areaCcod, carrCcod, asigCcod } = this.data;
          const result = await this.api.getDocentesPorAsignaruraV5(sedeCcod, areaCcod, carrCcod, asigCcod);

          if (result.success) {
            this.docentes = result.data.docentes;
            this.horario = result.data.horario;
            this.mostrarDocente = true;
          }
          break;
        }
        case Vistas.docente: {
          const { sedeCcod, docente } = this.data;
          const result = await this.api.getDocentesPorNombreV5(sedeCcod, docente);

          if (result.success) {
            this.docentes = result.data.docentes;
            this.horario = result.data.horario;
            this.mostrarDocente = true;
          }
          break;
        }
        case Vistas.sala: {
          if (this.pt.is('mobileweb')) {
            debugger
            const principal = await this.profile.getStorage('principal');
            const periodo = principal.periodos.find((t: any) => t.periCcod == principal.periodoActual);
            this.salaFecha = moment(periodo.acpeFinicio, 'DD/MM/YYYY').toDate();
            this.data.fecha = moment(periodo.acpeFinicio, 'DD/MM/YYYY').toDate();
          }
          else {
            this.salaFecha = moment().startOf('week').toDate();
            this.data.fecha = moment().startOf('week').toDate();
          }

          this.nombreSala = `${this.data.salaTdesc}`;
          this.mostrarSala = true;
          await this.cargarPlanificacionSala(this.data);
          break;
        }
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
    }
    finally {
      this.mostrarCargando = false;
    }
  }
  ionViewWillLeave() { }
  async accordionChange(e: any) {
    const persNcorr = e.detail.value;
    const isOpened = persNcorr != undefined;

    if (isOpened) {
      const docente = this.docentes.find(t => t.persNcorr == persNcorr);

      if (!docente.fecha) {
        if (this.pt.is('mobileweb')) {
          const principal = await this.profile.getStorage('principal');
          const periodo = principal.periodos.find((t:any) => t.periCcod == principal.periodoActual);
          docente.fecha = moment(periodo.acpeFinicio, 'DD/MM/YYYY').toDate();
        }
        else {
          docente.fecha = moment().startOf('week').toDate();
        }
      }

      await this.cargarPlanificacionDocente(docente);
    }
  }
  async correo(e:any, persTemail: string) {
    e.stopPropagation();

    try {
      await this.mensaje.crear(persTemail);
    }
    catch (error:any) {
      this.snackbar.showToast(error, 2000, 'danger');
    }
  }
  async cargarPlanificacionDocente(docente: any) {
    docente.cargando = true;

    try {
      const sedeCcod = this.data.sedeCcod;
      const persNcorr = docente.persNcorr;
      const fechaInicio = moment(docente.fecha).format('DD/MM/YYYY');
      const fechaTermino = moment(docente.fecha).clone().add('day', 6).format('DD/MM/YYYY');
      const result = await this.api.getPlanificacionDocenteV5(sedeCcod, persNcorr, fechaInicio, fechaTermino);

      let eventos:any[] = [];

      if (result.success && result.data.length) {
        result.data.forEach((event:any) => {
          event.bloques.forEach((bloque:any) => {
            let horario = this.horario.find((hora:any) => hora.horaCcod == bloque.horaCcod);
            let cssClass = '';

            if (bloque.enCurso == 1) cssClass = 'progreso';
            if (bloque.suspendida == 1) cssClass = 'suspendida';

            eventos.push({
              title: `<div style="white-space: normal">${bloque.asigTdesc} - <b>${bloque.asigCcod}</b><br/>
                      Sala : ${bloque.salaCiso} - ${bloque.salaTdesc}</div>`,
              start: moment(`${event.id} ${horario.horaHinicio}`, 'DD/MM/YYYY HH:mi').toDate(),
              end: moment(`${event.id} ${horario.horaHtermino}`, 'DD/MM/YYYY HH:mi').toDate(),
              cssClass: cssClass
            })
          })
        })
      }

      setTimeout(() => {
        docente.eventos = eventos;
      }, 0);

      this.cdRef.detectChanges();
    }
    catch (error:any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
    }
    finally {
      docente.cargando = false;
    }
  }
  async cargarPlanificacionSala(sala: any) {
    const sedeCcod = sala.sedeCcod;
    const salaCcod = sala.salaCcod.value;
    const fechaInicio = moment(sala.fecha).format('DD/MM/YYYY');
    const fechaTermino = moment(sala.fecha).clone().add(6, 'day').format('DD/MM/YYYY');

    this.cargandoSala = true;

    try {
      const result = await this.api.getPlanificacionSalaV5(sedeCcod, salaCcod, fechaInicio, fechaTermino);

      if (result.success) {
        this.horario = result.data.horario;

        let eventos :any[]= [];
        result.data.planificacion.forEach((dia:any) => {
          dia.bloques.forEach((bloque:any) => {

            const horario = this.horario.find((hora:any) => hora.horaCcod == bloque.horaCcod);

            if (horario) {
              eventos.push({
                title: bloque.asigTdesc + ' - <b>' + bloque.asigCcod + '</b><br/>Docente: ' + bloque.persTnombre,
                start: moment(`${dia.id} ${horario.horaHinicio}`, 'DD/MM/YYYY HH:mi').toDate(),
                end: moment(`${dia.id} ${horario.horaHtermino}`, 'DD/MM/YYYY HH:mi').toDate()
              })
            }

          });
        });

        this.salaEventos = eventos;
      }
    }
    catch (error:any) {
      if (error&& error.status == 401) {
        await this.error.handle(error);
        return;
      }
    }
    finally {
      this.cargandoSala = false;
    }
  }
  onEventClick(args: MbscEventClickEvent) { }
  onSelectedDateChange(args: MbscPageChangeEvent, docente: any) {
    if (!docente.cargando) {
      docente.fecha = moment(args.firstDay);
      this.cargarPlanificacionDocente(docente);
    }
  }
  onSelectedDateChange2(args: MbscPageChangeEvent) {
    this.data.fecha = moment(args.firstDay);
    this.cargarPlanificacionSala(this.data);
  }
  resolverFoto(persNcorr:any) {
    return `${this.global.Api}/api/v3/imagen-persona/${persNcorr}`;
  }
  get oppositeOrientation() {
    const { type } = screen.orientation;
    return type.startsWith("portrait") ? "landscape" : "portrait";
  }
  get backUrl() { return this.router.url.replace('/resultados', '') }

}

