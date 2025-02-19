import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, IonModal } from '@ionic/angular';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { AppGlobal } from 'src/app/app.global';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import * as desconocido from 'src/scripts/foto.desconocido';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.page.html',
  styleUrls: ['./estudiantes.page.scss'],
})
export class EstudiantesPage implements OnInit {

  @ViewChild('usuarioModal') modalUsuario!: IonModal;
  fotoDesconocido = desconocido.imgBase64;
  mostrarCargando = true;
  mostrarData = false;
  seccion: any;
  data: any;
  alumnos!: any[];
  usuario: any;

  constructor(private api: AlumnoService,
    private mensaje: MensajeService,
    private router: Router,
    private global: AppGlobal,
    private auth: AuthService,
    private snackbar: SnackbarService,
    private error: ErrorHandlerService) { }

  async ngOnInit() {
    this.seccion = this.router.getCurrentNavigation()?.extras.state;
    this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.COMPANEROS);
  }
  async cargar() {
    const auth = await this.auth.getAuth();
    const persNcorr = auth.user.data.persNcorr;

    try {
      let result = await this.api.getAlumnosV5(this.seccion.seccCcod);

      if (result.success) {
        this.alumnos = result.data.alumnos.filter((t: any) => t.persNcorr != persNcorr);
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
  resolverFoto(persNcorr: any) {
    return `${this.global.Api}/api/v3/imagen-persona/${persNcorr}`;
  }
  async info(data: any, modal: IonModal) {
    this.usuario = data;
    await modal.present();
  }
  async correo(persTemail: string, usuario: IonModal) {
    usuario.dismiss();

    try {
      await this.mensaje.crear(persTemail);
    }
    catch (error: any) {
      this.snackbar.showToast(error, 2000, 'danger');
    }
  }
  get asignatura() {
    return this.seccion ? this.seccion.asigTdesc : '';
  }
  get backUrl() {
    return this.router.url.replace('/estudiantes', '');
  }

}

