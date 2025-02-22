import { Component, OnInit } from '@angular/core';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';

@Component({
  selector: 'app-situaciones-pendientes',
  templateUrl: './situaciones-pendientes.page.html',
  styleUrls: ['./situaciones-pendientes.page.scss'],
})
export class SituacionesPendientesPage implements OnInit {

  bloqueos: any;
  mostrarData = false;
  mostrarCargando = true;

  constructor(private api: AlumnoService,
    private error: ErrorHandlerService) { }

  async ngOnInit() {
    await this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.SITUACIONES_PENDIENTES);
  }

  async cargar() {
    this.mostrarCargando = true;

    try {
      this.bloqueos = await this.api.getBloqueos();
    }
    catch (error: any) {
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
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }

}
