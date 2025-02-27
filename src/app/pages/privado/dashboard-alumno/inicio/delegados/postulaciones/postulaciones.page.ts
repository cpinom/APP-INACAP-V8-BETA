import { Component, inject, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { DelegadosService } from 'src/app/core/services/http/delegados.service';

interface DataResult {
  success: boolean,
  data: any,
  code: number,
  message?: string
};

@Component({
  selector: 'app-postulaciones',
  templateUrl: './postulaciones.page.html',
  styleUrls: ['./postulaciones.page.scss'],
})
export class PostulacionesPage implements OnInit {

  hideLoadingSpinner!: boolean;
  data: any;
  mostrarData = false;

  private api = inject(DelegadosService);
  private nav = inject(NavController);
  private error = inject(ErrorHandlerService);
  private dialog = inject(DialogService);
  private action = inject(ActionSheetController);

  constructor() { }

  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    try {
      let result: DataResult = await this.api.getPostulaciones();

      if (result.success) {
        if (!result.data.contestada) {
          result.data.bienvenida = result.data.bienvenida.replace('[CARRERA]', result.data.carrera);
          result.data.bienvenida = result.data.bienvenida.replace('[NIVEL]', result.data.nivel);
          result.data.bienvenida = result.data.bienvenida.replace('[JORNADA]', result.data.jornada);
        }

        this.data = result.data;
      }
      else {
        await this.presentError(result.message || 'Un error inesperado ha ocurrido.');
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }
    }
    finally {
      this.hideLoadingSpinner = true;
      this.mostrarData = true;
    }
  }
  async postular() {
    const result = await this.guardarPostulacion(this.data.evento.postulaOk);

    if (result) {
      this.presentSuccess('Tu postulación ha sido enviada exitosamente.')
    }
    else {
      this.presentError('Ha ocurrido un error mientras se procesaba tu solicitud. Vuelve a intentarlo.')
    }
  }
  async rechazar() {
    const confirmar = await this.confirmar('¿Estás seguro de que no deseas participar en el proceso de postulantes a delegado/a?');

    if (confirmar) {
      const result = await this.guardarPostulacion(this.data.evento.postulaRechaza);

      if (result) {
        this.presentSuccess('Tu preferencia se ha guardado correctamente.')
      }
      else {
        this.presentError('Ha ocurrido un error mientras se procesaba tu solicitud. Vuelva a intentarlo.')
      }
    }
  }
  async cancelar() {
    const result = await this.guardarPostulacion(this.data.evento.postulaCancela);

    if (result) {
      this.presentSuccess('Tu postulación ha sido cancelada exitosamente.')
    }
    else {
      this.presentError('Ha ocurrido un error mientras se procesaba tu solicitud. Vuelve a intentarlo.')
    }
  }
  async guardarPostulacion(respuestaId: string) {
    return new Promise<boolean>(async (resolve) => {
      const loading = await this.dialog.showLoading({ message: 'Procesando...' });
      let success = false;

      try {
        const params = {
          evenNcorr: this.data.evento.eventoId,
          formNcorr: this.data.evento.formularioId,
          resultado: JSON.stringify([{ id: this.data.evento.respuestaId, value: respuestaId }]),
          sedeCcod: this.data.sedeCcod,
          carrCcod: this.data.carrCcod,
          niveCcod: this.data.nivel,
          jornCcod: this.data.jornCcod
        };
        const result = await this.api.guardarPostulacion(params);

        if (result.success) {
          success = true;
        }
      }
      catch (error: any) {
        success = false;
      }
      finally {
        loading.dismiss();
      }

      if (success) {
        resolve(true);
      }
      else {
        resolve(false);
      }
    })
  }
  async presentSuccess(message: string) {
    await this.dialog.showAlert({
      header: this.data.titulo,
      backdropDismiss: false,
      keyboardClose: false,
      message: message,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.nav.navigateBack('alumno/inicio');
          }
        }
      ]
    });
  }
  async presentError(message: string) {
    await this.dialog.showAlert({
      header: 'Postulación Delegados',
      backdropDismiss: false,
      keyboardClose: false,
      cssClass: 'warning-alert',
      //message: '<div class="image"><ion-icon src="./assets/icon/warning.svg"></ion-icon></div>' + message,
      message: message,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.nav.navigateBack('alumno/inicio');
          }
        }
      ]
    });
  }
  confirmar(message: string, title?: string): Promise<boolean> {

    return new Promise(async (resolve) => {

      const actionSheet = await this.action.create({
        header: title || 'Postulaciones Delegados',
        subHeader: message,
        buttons: [
          {
            text: 'Continuar',
            role: 'destructive',
            handler: () => resolve(true)
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false)
          }
        ]
      });

      await actionSheet.present();

    })
  }

}
