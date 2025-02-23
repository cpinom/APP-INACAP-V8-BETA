import { Component, inject, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-modal-inscripcion',
  templateUrl: './modal-inscripcion.page.html',
  styleUrls: ['./modal-inscripcion.page.scss'],
})
export class ModalInscripcionPage implements OnInit {

  data: any;

  private api = inject(AlumnoService);
  private dialog = inject(DialogService);
  private error = inject(ErrorHandlerService);
  private snackbar = inject(SnackbarService);
  private action = inject(ActionSheetController);

  constructor() { }

  ngOnInit() { }
  async inscribir() {
    const confirm = await this.confirmarInscripcion();

    if (confirm) {
      const loading = await this.dialog.showLoading({ message: 'Guardando...' });

      try {
        const params = { reacNcorr: this.data.reacNcorr };
        const result = await this.api.guardarInscripcionActividad(params);
        const message = result.message ? result.message : result;

        await this.snackbar.showToast(message);
        await this.dialog.dismissModal(true);
      }
      catch (error) {
        await this.error.handle(error);
      }
      finally {
        await loading.dismiss();
      }
    }
  }
  async confirmarInscripcion() {
    return new Promise((resolve) => {
      this.action.create({
        subHeader: '¿Estás seguro que deseas inscribirte en la Actividad seleccionada?',
        header: 'Inscripción Actividad',
        buttons: [
          {
            text: 'Continuar',
            role: 'destructive',
            handler: async () => {
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
      }).then(action => action.present())
    })
  }
  async anular() {
    await this.dialog.showAlert({
      header: 'Detalle Inscripción',
      message: 'Para anular tu inscripción debe contactar a tu DAE.',
      buttons: ['Aceptar']
    });
  }
  async cerrar() {
    await this.dialog.dismissModal();
  }

}
