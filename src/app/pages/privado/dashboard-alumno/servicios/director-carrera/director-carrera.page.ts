import { Component, OnInit } from '@angular/core';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { AppGlobal } from 'src/app/app.global';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-director-carrera',
  templateUrl: './director-carrera.page.html',
  styleUrls: ['./director-carrera.page.scss'],
})
export class DirectorCarreraPage implements OnInit {

  data: any;
  sede!: string;
  carrera!: string;
  mostrarCargando = true;
  mostrarData = false;
  mostrarError = false;

  constructor(private global: AppGlobal,
    private profile: ProfileService,
    private snackbar: SnackbarService,
    private api: AlumnoService,
    private mensaje: MensajeService,
    private error: ErrorHandlerService) { }

  ngOnInit() {
    this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.DIRECTOR_CARRERA);
  }
  async cargar() {
    try {
      let principal = await this.profile.getStorage('principal');
      let programa = principal.programas[principal.programaIndex];
      let result = await this.api.getDirectorCarrera(programa.sedeCcod, programa.carrCcod)

      if (result.success) {
        this.data = result.data;
        this.carrera = programa.carrTdesc;
        this.sede = programa.sedeTdesc.toUpperCase();
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      this.mostrarError = true;

      if (error && error.status == 401) {
        await this.error.handle(error);
      }
    }
    finally {
      this.mostrarData = true;
      this.mostrarCargando = false;
    }
  }
  async recargar() {
    this.mostrarError = false;
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  async correo(persTemail: string) {
    try {
      await this.mensaje.crear(persTemail);
    }
    catch (error: any) {
      this.snackbar.showToast(error, 2000, 'danger');
    }
  }
  resolverFoto(persNcorr: string) {
    return `${this.global.Api}/api/v3/imagen-persona/${persNcorr}`;
  }
}


