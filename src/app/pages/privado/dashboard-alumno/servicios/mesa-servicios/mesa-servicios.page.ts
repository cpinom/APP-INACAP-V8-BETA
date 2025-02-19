import { Component, OnInit } from '@angular/core';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-mesa-servicios',
  templateUrl: './mesa-servicios.page.html'
})
export class MesaServiciosPage implements OnInit {

  mostrarWhatsApp = false;
  servicios: any;

  constructor(private mensaje: MensajeService,
    private snackbar: SnackbarService,
    private api: AlumnoService) { }

  async ngOnInit() {
    this.api.marcarVista(VISTAS_ALUMNO.MESA_SERVICIO);
  }
  async correo() {
    try {
      await this.mensaje.crear('ayuda&#64;inacap.cl');
    }
    catch (error: any) {
      this.snackbar.showToast(error, 2000, 'danger');
    }
  }

}
