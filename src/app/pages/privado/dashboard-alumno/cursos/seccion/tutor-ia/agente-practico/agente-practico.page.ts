import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TutorIaService } from 'src/app/core/services/http/tutor-ia.service';

@Component({
  selector: 'app-agente-practico',
  templateUrl: './agente-practico.page.html',
  styleUrls: ['./agente-practico.page.scss'],
})
export class AgentePracticoPage implements OnInit {

  private api = inject(TutorIaService);
  private router = inject(Router);

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

      if (!this.conversacionId) {

        const result = await this.api.iniciarAgentePractico(params);

        if (result.success) {
          this.conversacionId = result.data.thread_id;
          this.mensajes.push({ user: 'tutor', message: result.data.assistant_message });
          this.procesando = false;
        }

      }
      else {
        const result = await this.api.mensajeAgentePractico({ ...params, conversacionId: this.conversacionId });

        if (result.success) {
          this.mensajes.push({ user: 'tutor', message: result.data.assistant_message });
          this.procesando = false;
        }
      }
    }
  }
  reiniciar() {
    this.conversacionId = '';
    this.mensajes = [];
    this.mensaje = '';
  }

}
