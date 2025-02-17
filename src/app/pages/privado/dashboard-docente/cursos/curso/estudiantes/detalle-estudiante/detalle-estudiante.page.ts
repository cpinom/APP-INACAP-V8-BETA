import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DocenteService } from 'src/app/core/services/docente/docente.service';
import * as desconocido from 'src/scripts/foto.desconocido.js';
import * as $ from 'jquery';
import 'jquery-knob';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import * as moment from 'moment';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';
import { AppGlobal } from 'src/app/app.global';

@Component({
  selector: 'app-detalle-estudiante',
  templateUrl: './detalle-estudiante.page.html',
  styleUrls: ['./detalle-estudiante.page.scss'],
})
export class DetalleEstudiantePage implements OnInit {

  data: any;
  alumno: any;

  seccCcod!: string;
  ssecNcorr!: string;
  asigCcod!: string;
  ponderaciones: any;
  alumnoNcorr!: string;
  fotoDesconocido = desconocido.imgBase64;
  evaluacion: any;
  mostrarCargando = true;
  mostrarData = false;

  private api = inject(DocenteService);
  private global = inject(AppGlobal);
  private profile = inject(ProfileService);
  private mensaje = inject(MensajeService);
  private snackbar = inject(SnackbarService);
  private error = inject(ErrorHandlerService);
  private router = inject(Router);
  private nav = inject(NavController);

  constructor() { }

  async ngOnInit() {
    this.data = this.router.getCurrentNavigation()?.extras.state;
    this.cargar();
    this.api.marcarVista(VISTAS_DOCENTE.DETALLE_ALUMNO);
  }
  async cargar() {
    console.log(this.data);
    const principal = await this.profile.getStorage('principal');
    const { seccCcod, persNcorr } = this.data;
    const { periodo } = principal;

    try {
      const result = await this.api.getDetalleAlumnoV6(seccCcod, persNcorr, periodo);

      if (result.success) {
        const { notas } = result.data;

        try {
          const evaluaciones = notas.filter((t: any) => {
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
            this.evaluacion = notas[notas.length - 1];
          }
        }
        catch {
          this.evaluacion = notas[notas.length - 1];
        }

        this.alumno = result.data;
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        this.error.handle(error)
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }

    /*try {
      this.seccCcod = this.route.snapshot.paramMap.get('seccCcod');
      this.ssecNcorr = this.route.snapshot.paramMap.get('ssecNcorr');
      this.asigCcod = this.route.snapshot.paramMap.get('asigCcod');
      this.alumnoNcorr = this.route.snapshot.paramMap.get('alumnoNcorr');

      let result = await this.api.getDetalleAlumnoV5(this.seccCcod, this.alumnoNcorr);

      if (result.success) {
        let detalleAlumno = result.data;

        try {
          if (('detalle' in detalleAlumno.notas) && detalleAlumno.notas.detalle.length) {
            let evaluaciones = detalleAlumno.notas.detalle.filter(t => {
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
              this.evaluacion = detalleAlumno.notas.detalle[detalleAlumno.notas.detalle.length - 1];
            }
          }
        }
        catch {
          this.evaluacion = detalleAlumno.notas.detalle[detalleAlumno.notas.detalle.length - 1];
        }

        this.alumno = detalleAlumno;
        // this.drawChartAsistencia();
      }
      else {
        throw Error();
      }
    }
    catch (error) {
      if (error.status == 401) {
        this.error.handle(error)
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }*/
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  async evaluacionesTap() {
    const data = Object.assign(this.alumno, this.data);
    await this.nav.navigateForward(`${this.router.url}/evaluaciones`, { state: data })
  }
  // drawChartAsistencia() {
  //   let porcentaje = Number(this.alumno.asistencia.porcentajeHoras);
  //   let azul = this.colorAzul || '#1565C0';
  //   $(function () {
  //     $('.asistenciaChart').val(porcentaje).knob({
  //       width: 70,
  //       height: 70,
  //       readOnly: true,
  //       bgColor: '#eee',
  //       fgColor: azul,
  //       format: function (value) {
  //         return `${value}%`;
  //       }
  //     });
  //   });
  // }
  resolverFechaEvaluacion(caliFevaluacion: string) {
    return moment(caliFevaluacion, 'DD/MM/YYYY').locale('es').format('<b>DD</b> MMM').replace('.', '');
  }
  resolverNotaRojo(nota: string) {
    if (!nota || nota == '--' || nota == 'X')
      return 'gris';

    if (parseInt(nota) < 4) {
      return 'rojo';
    }

    return '';
  }
  resolverFoto(persNcorr: any) {
    return `${this.global.Api}/api/v3/imagen-persona/${persNcorr}`;
  }
  async correo(persTemail: string) {
    try {
      await this.mensaje.crear(persTemail);
    }
    catch (error: any) {
      await this.snackbar.showToast(error, 2000, 'danger');
    }
  }
  get nombreCompleto() {
    if (this.data) {
      return `${this.data.persTnombre} ${this.data.persTapePaterno} ${this.data.persTapeMaterno || ''}`;
    }

    return '';
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
    return this.router.url.replace('/' + this.alumnoNcorr, '');
  }

}

