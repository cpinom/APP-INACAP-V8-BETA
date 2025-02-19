import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppGlobal } from 'src/app/app.global';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import * as desconocido from 'src/scripts/foto.desconocido';

@Component({
  selector: 'app-estudiante-tut',
  templateUrl: './estudiante-tut.page.html',
  styleUrls: ['./estudiante-tut.page.scss'],
})
export class EstudianteTutPage implements OnInit {

  data: any;
  alumno: any;
  mostrarCargando = true;
  mostrarData = false;
  private api = inject(DocenteService);
  private error = inject(ErrorHandlerService);
  private router = inject(Router);
  private global = inject(AppGlobal);
  private mensaje = inject(MensajeService);
  private snackbar = inject(SnackbarService);

  constructor() { }

  ngOnInit() {
    this.data = this.router.getCurrentNavigation()?.extras.state;
    this.cargar();
  }
  async cargar() {
    try {
      const { matrNcorr, tupaNcorr } = this.data;
      const result = await this.api.getFichaAlumnoTutoria(matrNcorr, tupaNcorr);

      if (result.success) {
        this.alumno = result.data;
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
  async correo(persTemail: string) {
    try {
      await this.mensaje.crear(persTemail);
    }
    catch (error: any) {
      this.snackbar.showToast(error, 2000, 'danger');
    }
  }
  get backPath() {
    return this.router.url.replace('/estudiante', '');
  }

}
