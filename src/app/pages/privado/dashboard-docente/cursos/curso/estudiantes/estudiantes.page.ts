import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocenteService } from 'src/app/core/services/docente/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { NavController } from '@ionic/angular';
import { AppGlobal } from 'src/app/app.global';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.page.html',
  styleUrls: ['./estudiantes.page.scss'],
})
export class EstudiantesPage implements OnInit {

  data: any;
  alumnos: any;
  mostrarData = false;
  mostrarCargando = true;

  private api = inject(DocenteService);
  private error = inject(ErrorHandlerService);
  private global = inject(AppGlobal);
  private router = inject(Router);
  private nav = inject(NavController);

  constructor() { }

  async ngOnInit() {
    this.data = this.router.getCurrentNavigation()?.extras.state;
    this.cargar();
    this.api.marcarVista(VISTAS_DOCENTE.ALUMNOS);
  }
  async cargar() {
    const { seccCcod, ssecNcorr } = this.data;

    try {
      const result = await this.api.getAlumnosSeccion(seccCcod, ssecNcorr);

      if (result.success) {
        this.alumnos = result.data.alumnos;
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
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  async alumnoTap(data: any) {
    const { seccCcod, ssecNcorr, asigTdesc } = this.data;
    data = Object.assign(data, { seccCcod: seccCcod, ssecNcorr: ssecNcorr, asigTdesc: asigTdesc });
    await this.nav.navigateForward(`${this.router.url}/detalle-estudiante`, { state: data });
  }
  resolverFoto(persNcorr: any) {
    return `${this.global.Api}/api/v3/imagen-persona/${persNcorr}`;
  }
  get backUrl() { return this.router.url.replace('/estudiantes', ''); }

}