import { AfterViewInit, Component, inject } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import * as desconocido from 'src/scripts/foto.desconocido';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { AppGlobal } from 'src/app/app.global';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { Router } from '@angular/router';

@Component({
  selector: 'app-progresion',
  templateUrl: './progresion.page.html',
  styleUrls: ['./progresion.page.scss'],
})
export class ProgresionPage implements AfterViewInit {

  fotoDesconocido = desconocido.imgBase64;
  carrera: any;
  data: any;
  poseeRA = false;
  poseeRN = false;
  eficienciaChart: any;
  avanceChart: any;
  mostrarData = false;
  mostrarCargando = true;
  status: any;

  private profile = inject(ProfileService);
  private api = inject(AlumnoService);
  private error = inject(ErrorHandlerService);
  private global = inject(AppGlobal);
  private utils = inject(UtilsService);
  private mensaje = inject(MensajeService);
  private snackbar = inject(SnackbarService);
  private router = inject(Router);

  constructor() { }

  ngAfterViewInit() { }
  async ngOnInit() {
    this.status = await this.profile.getStorage('status');
    await this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.PROGRESION);
  }
  recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  async cargar() {
    try {
      let principal = await this.profile.getStorage('principal');
      let programa = principal.programas[principal.programaIndex];
      let result = await this.api.getProgresionV5(programa.carrCcod);

      if (result.success) {
        result.data.riesgosAcademicos.forEach((asignatura: any) => {
          if (asignatura.riesgoasistencia == 1) {
            this.poseeRA = true;
          }
          if (asignatura.riesgonota == 1) {
            this.poseeRN = true;
          }
        });

        this.data = result.data;
        this.carrera = programa;
      }
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
  async detalleRiesgos(modal: IonModal) {
    await modal.present();
  }
  resolverFoto(persNcorr: any) {
    return `${this.global.Api}/api/v3/imagen-persona/${persNcorr}`;
  }
  resolverIconoPlataforma(nombre: string) {
    if (nombre) {
      if (nombre.toLocaleLowerCase().includes('matemáticas')) {
        return 'calculate';
      }
      if (nombre.toLocaleLowerCase().includes('química')) {
        return 'science';
      }
    }
    return 'file_copy';
  }
  async abrirPlataforma(url: string) {
    if (url.startsWith('//')) {
      url = `https:${url}`
    }
    await this.utils.openLink(url);
  }
  async apoyoTutor() {
    try {
      await this.mensaje.crear(this.data.tutorAsignado.correo, 'Solicitud de Reunión');
    }
    catch (error: any) {
      this.snackbar.showToast(error, 2000, 'danger');
    }
  }
  get backText() {
    return this.router.url.startsWith('/dashboard-alumno/portafolio') ? 'Portafolio' : 'Inicio';
  }
  get backUrl() {
    return this.router.url.startsWith('/dashboard-alumno/portafolio') ? '/dashboard-alumno/portafolio' : '/dashboard-alumno/inicio';
  }

}
