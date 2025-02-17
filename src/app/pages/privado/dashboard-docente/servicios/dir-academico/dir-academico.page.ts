import { Component, inject, OnInit } from '@angular/core';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import * as desconocido from 'src/scripts/foto.desconocido';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { AppGlobal } from 'src/app/app.global';

@Component({
  selector: 'app-dir-academico',
  templateUrl: './dir-academico.page.html',
  styleUrls: ['./dir-academico.page.scss'],
})
export class DirAcademicoPage implements OnInit {

  fotoDesconocido = desconocido.imgBase64;
  principal: any;
  personas: any;
  mostrarData = false;
  mostrarCargando = true;

  private api = inject(DocenteService);
  private mensaje = inject(MensajeService);
  private snackbar = inject(SnackbarService);
  private global = inject(AppGlobal);
  private error = inject(ErrorHandlerService);
  private profile = inject(ProfileService);

  constructor() { }

  async ngOnInit() {
    this.principal = await this.profile.getStorage("principal");
    await this.cargar();
  }
  async cargar() {
    try {
      const { sedeCcod } = this.principal;
      const result = await this.api.getDirectoresAcademicosV6(sedeCcod);

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


