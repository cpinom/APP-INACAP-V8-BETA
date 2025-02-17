import { Component, inject, OnInit } from '@angular/core';
import { AppGlobal } from 'src/app/app.global';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-dir-carrera',
  templateUrl: './dir-carrera.page.html',
  styleUrls: ['./dir-carrera.page.scss'],
})
export class DirCarreraPage implements OnInit {

  personas: any;
  mostrarData = false;
  mostrarCargando = true;

  private api = inject(DocenteService);
  private error = inject(ErrorHandlerService);
  private mensaje = inject(MensajeService);
  private snackbar = inject(SnackbarService);
  private global = inject(AppGlobal);

  constructor() { }

  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    try {
      const result = await this.api.getDirectoresCarrerasV6();

      if (result.success) {
        this.personas = result.data.directores;
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
  resolverFoto(persNcorr: any) {
    return `${this.global.Api}/api/v3/imagen-persona/${persNcorr}`;
  }
  async correo(persTemail: string) {
    try {
      await this.mensaje.crear(persTemail);
    }
    catch (error: any) {
      this.snackbar.showToast(error, 2000, 'danger');
    }
  }

}


