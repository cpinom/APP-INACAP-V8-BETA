import { Component, OnInit } from '@angular/core';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { AppGlobal } from 'src/app/app.global';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-docentes',
  templateUrl: './docentes.page.html',
  styleUrls: ['./docentes.page.scss'],
})
export class DocentesPage implements OnInit {

  carrera: any;
  docentes: any;
  mostrarCargando = true;
  mostrarData = false;

  constructor(private api: AlumnoService,
    private profile: ProfileService,
    private error: ErrorHandlerService,
    private global: AppGlobal,
    private mensaje: MensajeService,
    private snackbar: SnackbarService) { }

  ngOnInit() {
    this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.DOCENTES);
  }
  async cargar() {
    try {
      let principal = await this.profile.getStorage('principal');
      let programa = principal.programas[principal.programaIndex];

      this.carrera = programa;

      let result = await this.api.getDocentesV5(programa.carrCcod);

      if (result.success) {
        const { data } = result;
        this.docentes = data.docentes;
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
  async recargar() {
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
  resolverFoto(persNcorr) {
    return `${this.global.Api}/api/v3/imagen-persona/${persNcorr}`;
  }

}

