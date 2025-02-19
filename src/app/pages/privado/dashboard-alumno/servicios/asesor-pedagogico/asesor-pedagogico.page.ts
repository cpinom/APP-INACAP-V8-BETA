import { Component, OnInit } from '@angular/core';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { AppGlobal } from 'src/app/app.global';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-asesor-pedagogico',
  templateUrl: './asesor-pedagogico.page.html',
  styleUrls: ['./asesor-pedagogico.page.scss'],
})
export class AsesorPedagogicoPage implements OnInit {

  personas: any;
  mostrarCargando = true;
  mostrarData = false;

  constructor(private profile: ProfileService,
    private api: AlumnoService,
    private mensaje: MensajeService,
    private snackbar: SnackbarService,
    private global: AppGlobal,
    private error: ErrorHandlerService) { }

  ngOnInit() {
    this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.ASESOR_PEDAGOGICO);
  }
  async cargar() {
    let principal = await this.profile.getStorage('principal');
    let programa = principal.programas[principal.programaIndex];

    try {
      let result = await this.api.getAsesorPedagogicoV5(programa.sedeCcod);

      if (result.success) {
        this.personas = result.data;
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
      this.mostrarData = true;
      this.mostrarCargando = false;
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
