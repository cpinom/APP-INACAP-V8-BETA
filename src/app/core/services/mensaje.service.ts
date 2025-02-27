import { inject, Injectable } from '@angular/core';
import { MensajeComponent } from '../components/mensaje/mensaje.component';
import { InacapMailService } from './http/inacapmail.service';
import { SnackbarService } from './snackbar.service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from './error-handler.service';
import { DialogService } from './dialog.service';
import { AppGlobal } from 'src/app/app.global';
import { AlumnoService } from './http/alumno.service';
import { DocenteService } from './http/docente.service';
import { ExalumnoService } from './http/exalumno.service';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  emailRegexp = new RegExp('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}');

  private dialog = inject(DialogService);
  private api = inject(InacapMailService);
  private snackbar = inject(SnackbarService);
  private global = inject(AppGlobal);
  private router = inject(Router);
  private alumnoApi = inject(AlumnoService);
  private docenteApi = inject(DocenteService);
  private exalumnoApi = inject(ExalumnoService);
  private error = inject(ErrorHandlerService);

  constructor() { }

  async crear(correo?: string, asunto?: string) {
    correo = correo || '';
    asunto = asunto || '';

    if (correo && !this.global.Integration) {
      let isValid = this.emailRegexp.test(correo);

      if (!isValid) {
        return Promise.reject(`El correo "${correo}" es inválido.`);
      }
    }

    let generarCorreo = true;

    if (correo) {
      generarCorreo = await this.confirmarEnvio(correo)
    }

    if (!generarCorreo) {
      return Promise.resolve();
    }

    const message = await this.snackbar.create('Creando mensaje...', false, 'medium');

    message.present();

    try {
      let params = {
        destinatarios: correo,
        asunto: asunto,
        cuerpo: '\n\n\n\n\n\n\n\n\nEnviado desde APP INACAP'
      };
      let result = await this.api.createMessage(params);
      let api;
      let users;

      if (!result.success) {
        return Promise.reject(result.message);
      }

      message.dismiss();

      if (this.esAlumno) api = this.alumnoApi;
      else if (this.esDocente) api = this.docenteApi;
      else if (this.esExalumno) api = this.exalumnoApi;

      users = api && (await api.getStorage('users'));
      users = users || [];

      await this.dialog.showModal({
        component: MensajeComponent,
        componentProps: {
          messageId: result.id,
          users: users,
          correo: correo,
          asunto: params.asunto,
          cuerpo: params.cuerpo
        },
        presentingElement: getRouterOutlet() || undefined
      });

      return Promise.resolve();
    }
    catch (error: any) {
      if (error?.status == 401) {
        await this.error.handle(error);
        return;
      }
      return Promise.reject('Error creando mensaje.');
    }
    finally {
      await message.dismiss();
    }
  }
  async borrador(message: any) {
    let api;
    let users;

    if (this.esAlumno) api = this.alumnoApi;
    else if (this.esDocente) api = this.docenteApi;
    else if (this.esExalumno) api = this.exalumnoApi;

    users = api && (await api.getStorage('users'));
    users = users || [];

    await this.dialog.showModal({
      component: MensajeComponent,
      componentProps: {
        messageId: message.id,
        users: users,
        correo: message.toRecipients.map((x: any) => x.emailAddress.address).join(','),
        asunto: message.subject,
        cuerpo: message.bodyPreview,
        hasAttachments: message.hasAttachments,
        isDraft: true
      },
      presentingElement: getRouterOutlet() || undefined
    });
  }
  async responder(message: any) {
    let params = {
      messageId: message.id,
      asunto: '',
      cuerpo: '\n\n\n\n\n\n\n\n\nEnviado desde APP INACAP'
    };

    const snackbar = await this.snackbar.create('Creando respuesta...', false, 'medium');

    snackbar.present();

    try {
      let result = await this.api.createReply(params);

      if (!result.success) {
        return Promise.reject(result.message);
      }

      await this.dialog.showModal({
        component: MensajeComponent,
        componentProps: {
          messageId: result.id,
          message: message,
          isReply: true
        },
        presentingElement: getRouterOutlet() || undefined
      });
    }
    catch (error: any) {
      if (error?.status == 401) {
        await this.error.handle(error);
        return;
      }
      return Promise.reject('Error creando mensaje.');
    }
    finally {
      snackbar.dismiss();
    }

  }
  async confirmarEnvio(correo: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      await this.dialog.showActionSheet({
        header: `Nuevo correo para ${correo}`,
        buttons: [
          {
            text: 'Enviar Correo',
            role: 'destructive',
            handler: () => {
              resolve(true)
            }
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              resolve(false)
            }
          }
        ]
      })
    })
  }
  get esAlumno() { return this.router.url.startsWith('/dashboard-alumno'); }
  get esDocente() { return this.router.url.startsWith('/dashboard-docente'); }
  get esExalumno() { return this.router.url.startsWith('/dashboard-exalumno'); }

}

export function getRouterOutlet() {
  return document.getElementById('ion-router-outlet-content');
}
