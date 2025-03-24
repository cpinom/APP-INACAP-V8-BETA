import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import Chart from 'chart.js/auto';
import 'jquery-knob';
import * as moment from 'moment';
import { NavController, Platform } from '@ionic/angular';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.page.html',
  styleUrls: ['./curso.page.scss'],
})
export class CursoPage implements OnInit {

  @ViewChild('tiposAlumnosChart') private tiposAlumnosCanvas!: ElementRef;
  @ViewChild('asistenciaChart') private asistenciaCanvas!: ElementRef;
  asistencia: any;
  // backText: string;
  data: any;
  objectKeys = Object.keys;
  hasRiesgo = true;
  tiposAlumnos: any;
  oportunidades: any;
  promedios: any;
  evalDocente: any;
  seccion: any;
  tiposAlumnosChart: any;
  asistenciaChart: any;
  mostrarData = false;
  mostrarCargando = true;

  constructor(private api: DocenteService,
    private error: ErrorHandlerService,
    private router: Router,
    private nav: NavController,
    private pt: Platform) {
    moment.locale('es');
    this.seccion = this.router.getCurrentNavigation()?.extras.state;
    console.log(this.seccion);
  }
  async ngOnInit() {
    this.cargar();
    this.api.marcarVista(VISTAS_DOCENTE.DETALLE_CURSO);
  }
  async cargar() {
    const seccion = this.seccion;
    const { seccCcod, ssecNcorr } = seccion;

    try {
      const result = await this.api.getDetalleCursoV6(seccCcod, ssecNcorr);

      if (result.success) {
        this.data = Object.assign(seccion, result.data);
        this.resolverTipoAlumnos(this.data.tiposAlumnos);
        // Gráficos
        setTimeout(() => {
          this.drawChartAsistencia();
        }, 100);
      }
    }
    catch (error: any) { }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }


  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  async resolverTipoAlumnos(data: any[]) {
    let trabajadores = 0;
    let noTrabajadores = 0;

    data.forEach(element => {
      if (element.label === 'Trabajador') {
        trabajadores = element.value;
      }
      else {
        noTrabajadores = element.value;
      }
    });

    const tipos = {
      'trabajadores': trabajadores,
      'noTrabajadores': noTrabajadores,
      'total': trabajadores + noTrabajadores
    };
    this.tiposAlumnos = tipos;

    setTimeout(() => {
      this.drawChartTiposAlumnos();
    }, 100);
  }
  drawChartAsistencia() {
    this.asistenciaChart = new Chart(this.asistenciaCanvas.nativeElement, {
      type: 'doughnut',
      options: {
        responsive: true,
        maintainAspectRatio: false
      },
      data: {
        datasets: [{
          data: [
            this.data.asistencia.presentes,
            this.data.asistencia.ausentes
          ],
          backgroundColor: [
            '#1565c0',
            '#ffce00'
          ]
        }]
      }
    });
    // const porcentaje = Number(this.asistencia.porcPresentes);
    // let azul = this.colorAzul || '#1565C0';
    // $(function () {
    //   $('.asistenciaChart').val(porcentaje).knob({
    //     width: 70,
    //     height: 70,
    //     readOnly: true,
    //     bgColor: '#eee',
    //     fgColor: azul,
    //     format: function (value) {
    //       return `${value}%`;
    //     }
    //   });
    // });
  }
  drawChartTiposAlumnos() {
    this.tiposAlumnosChart = new Chart(this.tiposAlumnosCanvas.nativeElement, {
      type: 'doughnut',
      options: {
        responsive: true,
        maintainAspectRatio: false
      },
      data: {
        datasets: [{
          data: [
            this.tiposAlumnos.trabajadores,
            this.tiposAlumnos.noTrabajadores
          ],
          backgroundColor: [
            '#1565c0',
            '#ffce00'
          ]
        }]
      }
    });
    // const porcentaje = Number(this.tiposAlumnos.trabajadores);
    // let azul = this.colorAzul || '#1565C0';
    // $(function () {
    //   $('.tiposAlumnosChart').val(porcentaje).knob({
    //     width: 70,
    //     height: 70,
    //     readOnly: true,
    //     bgColor: '#eee',
    //     fgColor: azul,
    //     format: function (value) {
    //       return `${value}%`;
    //     }
    //   });
    // });
  }
  resolverFechaAsistencia(fecha: string) {
    if (fecha) {
      return moment(fecha, 'DD/MM/YYYY').format('LLLL').replace('0:00', '');
    }
    else {
      return '';
    }
  }
  resolverNotaRojo(nota: any) {
    if (parseInt(nota, 10) < 4) {
      return 'rojo';
    }
    return '';
  }
  async descriptorTap() {
    await this.nav.navigateForward(`${this.router.url}/descriptor-asignatura`, { state: this.data.asigCcod });
  }
  async evaluacionesTap() {
    await this.nav.navigateForward(`${this.router.url}/evaluaciones`, { state: this.data });
  }
  async alumnosTap() {
    await this.nav.navigateForward(`${this.router.url}/estudiantes`, { state: this.data });
  }
  async recuperacionTap() {
    await this.nav.navigateForward(`${this.router.url}/recuperacion`, { state: this.data });
  }
  async tutorIATap() {
    debugger
  }
  get semanaHorario() {
    let fechaInicio = moment().startOf('isoWeek');
    let fechaTermino = fechaInicio.clone().add(5, 'day');

    if (fechaInicio.format('MM') == fechaTermino.format('MM')) {
      return fechaInicio.format('D') + ' al ' + fechaTermino.format('D [de] MMM');
    }
    else {
      return fechaInicio.format('D [de] MMM') + ' al ' + fechaTermino.format('D [de] MMM');
    }
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
  get backText() {
    const { url } = this.router;
    return url.startsWith('/dashboard-docente/inicio') ? 'Inicio' : 'Cursos';
  }
  get backUrl() {
    const { url } = this.router;
    return url.startsWith('/dashboard-docente/inicio') ? '/dashboard-docente/inicio' : '/dashboard-docente/cursos';
  }

  get mostrarTutorIA() {
    if (this.pt.is('mobileweb')) {
      return true;
    }

    if (this.seccion) {
      const asignaturas = 'TEAF01|MIA301|MAEA32'.split("|");
      const existe = asignaturas.includes(this.seccion.asigCcod);
      return existe;
    }

    return false;
  }

}
