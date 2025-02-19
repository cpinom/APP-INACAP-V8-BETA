import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-bibliografia',
  templateUrl: './bibliografia.page.html',
  styleUrls: ['./bibliografia.page.scss'],
})
export class BibliografiaPage implements OnInit {

  mostrarCargando = true;
  mostrarData = false;
  data: any;
  seccion: any;

  constructor(private api: AlumnoService,
    private router: Router,
    private utils: UtilsService,
    private error: ErrorHandlerService,
    private dialog: DialogService) { }

  ngOnInit() {
    this.seccion = this.router.getCurrentNavigation()?.extras.state;
    this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.BIBLIOGRAFIA);
  }
  async cargar() {
    try {
      const response = await this.api.getBibliografia(this.seccion.asigCcod);

      if (response.success) {
        this.data = response.data?.bibliografia;
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
  async abrirBibliografia(url: string) {
    if (url.includes('ezproxy.dnb-inacap')) {
      const urlParam = url.replace('https://ezproxy.dnb-inacap.cl/login?url=', '');

      if (urlParam) {
        await this.abrirNavegador(urlParam);
        return;
      }
    }

    this.abrirNavegador(url);
  }
  async abrirNavegador(url: string) {
    await this.utils.openLink(url)
  }
  async alertaLibro() {
    await this.dialog.showAlert({
      header: 'Bibliografía',
      message: 'Material no disponible en línea. Para ver si este material está disponible, acércate de manera presencial a la biblioteca.',
      buttons: ['Aceptar']
    });
  }
  get asignatura() {
    return this.seccion ? this.seccion.asigTdesc : '';
  }
  get backUrl() {
    return this.router.url.replace('/bibliografia', '');
  }

}
