import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { TutorIaService } from 'src/app/core/services/http/tutor-ia.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-agente-practico',
  templateUrl: './agente-practico.page.html',
  styleUrls: ['./agente-practico.page.scss'],
})
export class AgentePracticoPage implements OnInit {

  private api = inject(TutorIaService);
  private router = inject(Router);
  private error = inject(ErrorHandlerService);
  private snackbar = inject(SnackbarService);

  seccion: any;
  mensaje: string = '';
  mensajes: any[] = [];
  conversacionId!: string;
  procesando = false;

  constructor() {
    this.seccion = this.router.getCurrentNavigation()?.extras.state;
    console.log(this.seccion);
  }

  ngOnInit() {
    this.marcarVista();
  }
  async enviarMensaje() {
    if (this.mensaje.trim().length > 0) {
      this.mensajes.push({ user: 'alumno', message: this.mensaje });
      this.procesando = true;

      const params = {
        asigCcod: this.seccion.asigCcod,
        mensaje: this.mensaje
      };

      this.mensaje = '';

      try {

        if (!this.conversacionId) {

          const result = await this.api.iniciarAgentePractico(params);

          if (result.success) {
            this.conversacionId = result.data.thread_id;
            this.mensajes.push({ user: 'tutor', message: result.data.assistant_message });
            this.procesando = false;
          }

          this.marcarVista(true);
        }
        else {
          const result = await this.api.mensajeAgentePractico({ ...params, conversacionId: this.conversacionId });

          if (result.success) {
            this.mensajes.push({ user: 'tutor', message: result.data.assistant_message });
            this.procesando = false;
          }
        }
      }
      catch (error: any) {
        if (error && error.status == 401) {
          await this.error.handle(error);
          return;
        }

        await this.snackbar.showToast('Ocurrió un error al enviar el mensaje');
      }
      finally {
        this.procesando = false;
      }
    }
  }
  reiniciar() {
    this.conversacionId = '';
    this.mensajes = [];
    this.mensaje = '';
  }
  marcarVista(inicia?: boolean) {
    if (this.esAlumno) {
      if (inicia) this.api.marcarVista(VISTAS_ALUMNO.TUTOR_IA_INICIA_PRACTICO);
      else this.api.marcarVista(VISTAS_ALUMNO.TUTOR_IA_PRACTICO);
    }
    else {
      if (inicia) this.api.marcarVista(VISTAS_DOCENTE.TUTOR_IA_INICIA_PRACTICO);
      else this.api.marcarVista(VISTAS_DOCENTE.TUTOR_IA_PRACTICO);
    }
  }
  get esAlumno() { return this.router.url.startsWith('/dashboard-alumno'); }

}
