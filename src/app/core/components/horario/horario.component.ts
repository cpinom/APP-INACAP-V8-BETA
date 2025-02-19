import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import { ProfileService } from '../../services/profile.service';
import * as moment from 'moment';
import { MbscEventClickEvent, MbscEventcalendarView, MbscPageChangeEvent, localeEs } from '@mobiscroll/angular';
import { AppGlobal } from 'src/app/app.global';

enum Rol {
  Alumno = 'alumno',
  Docente = 'docente'
}

@Component({
  selector: 'horario-comp',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.scss'],
})
export class HorarioComponent implements OnInit {

  @Input() rol!: string;
  @Output() onEventoTap: EventEmitter<any> = new EventEmitter();
  @Output() onAfterLoad: EventEmitter<any> = new EventEmitter();
  @Output() onCompleteLoad: EventEmitter<any> = new EventEmitter();
  @Output() onError: EventEmitter<any> = new EventEmitter();
  @Output() onChangeOrientation: EventEmitter<any> = new EventEmitter();
  planificacion = false;
  asignaturasVirtuales: any;
  theme: any;
  themeVariant: any;
  fecha: any;
  eventos: any;
  cargando = false;
  // myView: MbscEventcalendarView = { agenda: { type: 'week' } };
  myView: MbscEventcalendarView = {
    calendar: { type: 'week' },
    agenda: { type: 'day' },
  };
  pickerLocale = localeEs;

  private alumnoApi = inject(AlumnoService);
  private docenteApi = inject(DocenteService);
  private profile = inject(ProfileService);
  private pt = inject(Platform);
  private global = inject(AppGlobal);

  constructor() {

    moment.locale('es');

    this.theme = 'ios'; //this.pt.is('ios') ? 'ios' : 'material';
    this.themeVariant = this.profile.isDarkMode() ? 'dark' : 'light';

    screen.orientation.addEventListener("change", () => {
      if (this.oppositeOrientation == 'portrait') {
        this.myView = { schedule: { type: 'week', allDay: false } };
      }
      else {
        this.myView = {
          agenda: { type: 'week' },
        }
      }

      this.onChangeOrientation.emit(this.oppositeOrientation);
    });
  }
  get oppositeOrientation() {
    const { type } = screen.orientation;
    return type.startsWith("portrait") ? "landscape" : "portrait";
  }
  async ngOnInit() {
    if (this.pt.is('mobileweb')) {
      this.fecha = moment('11/03/2024', 'DD/MM/YYYY').toDate();

      if (this.rol == Rol.Docente) {
        const principal = await this.profile.getStorage('principal');
        const periodo = principal.periodos.find((t: any) => t.periCcod == principal.periodo);

        if (periodo) {
          this.fecha = moment(periodo.acpeFinicio, 'DD/MM/YYYY').toDate();
        }
      }

    }
    else {
      this.fecha = moment().toDate();
    }
    this.cargar();
  }
  async cargar() {
    let fecha = this.getRango();
    let fechaInicio = fecha.inicio.format('DD/MM/YYYY');
    let fechaTermino = fecha.termino.format('DD/MM/YYYY');
    let horario = [];
    let asignaturasVirtuales = [];

    try {
      this.onAfterLoad.emit();
      this.cargando = true;

      if (this.rol == Rol.Alumno) {
        let principal = await this.profile.getStorage('principal');
        let programa = principal.programas[principal.programaIndex];
        let params = { sedeCcod: programa.sedeCcod, carrCcod: programa.carrCcod, fechaInicio: fechaInicio, fechaTermino: fechaTermino };
        let result = await this.alumnoApi.getHorario(params);

        if (result) {
          horario = result.planificacion;
          asignaturasVirtuales = result.asignaturasVirtuales;
        }
        else {
          throw Error();
        }
      }
      else if (this.rol == Rol.Docente) {
        const fechaLunes = moment(this.fecha).clone().startOf('week');
        const fechaInicio = fechaLunes.clone().startOf('week').format('DD/MM/YYYY');
        const fechaTermino = fechaLunes.clone().add(5, 'day').format('DD/MM/YYYY');

        const result = await this.docenteApi.getHorarioV6(fechaInicio, fechaTermino);

        if (result.success) {
          horario = result.data;
        }
      }
      else {
        throw Error();
      }

      var eventos: any[] = [];

      if (horario && horario.length) {
        horario.forEach((dia: any) => {
          dia.eventos.forEach((bloque: any) => {
            let cssClass = '';

            if (bloque.estado == 1) cssClass = 'suspendida';
            if (bloque.estado == 2 || bloque.estado == 4) cssClass = 'progreso';
            if (bloque.estado == 3) cssClass = 'realizada';

            let titulo = `${bloque.asignatura}<br/>Docente: ${bloque.profesor}<br/>Sala: ${bloque.sala}`;

            if (this.esDocente) {
              titulo = `${bloque.asignatura}<br/>Sección: ${bloque.seccion}<br/>Sala: ${bloque.sala}`;
            }

            eventos.push({
              title: titulo,
              start: moment(`${dia.fecha} ${bloque.horaInicio}`, 'DD/MM/YYYY HH:mi').toDate(),
              end: moment(`${dia.fecha} ${bloque.horaTermino}`, 'DD/MM/YYYY HH:mi').toDate(),
              cssClass: cssClass,
              data: bloque
            })

          });
        })
      }

      this.eventos = eventos;
      this.asignaturasVirtuales = asignaturasVirtuales;
      this.planificacion = true;
      this.onCompleteLoad.emit();
    }
    catch (error: any) {
      this.onError.emit(error);
      return;
    }
    finally {
      this.cargando = false;
    }
  }
  onSelectedDateChange(args: MbscPageChangeEvent) {
    this.fecha = args.firstDay;
    this.cargar();
  }
  onEventClick(args: MbscEventClickEvent) {
    this.onEventoTap.emit(args.event['data']);
  }
  resolverEstado(estadoClase: any) {
    switch (estadoClase) {
      case 1:
        return ['red', 'Suspendida']; // Texto manipulable desde la API, para avisar tb Cambio de Sala
      case 2:
      case 4:
        return ['green', ''];
      case 3:
        return 'blue';
      default:
        return 'gray';
    }
  }
  async cambiarSede() {
    // Solo para docente
    // let params = { sedeCcod: this.sedeSelected };
    // const bloquesSede = await this.docenteApi.getHorarioSede(params);
    // await this.profile.setStorage('sede_horario', this.sedeSelected);
    // this.bloquesSede = bloquesSede;
    // this.mostrarError = false;
    // this.cargar();
  }
  getRango() {
    const fechaInicio = moment(this.fecha).clone();
    const fechaTermino = moment(this.fecha).clone().add(5, 'day');

    return {
      inicio: fechaInicio,
      termino: fechaTermino
    };
  }
  public get esAlumno() { return this.rol == Rol.Alumno; }
  public get esDocente() { return this.rol == Rol.Docente; }
}
