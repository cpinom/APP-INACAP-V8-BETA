import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-disponibilidad',
  templateUrl: './disponibilidad.page.html',
  styleUrls: ['./disponibilidad.page.scss'],
})
export class DisponibilidadPage implements OnInit {

  bloques: any[] | undefined;
  data: any;

  constructor(private action: ActionSheetController,
    private api: DocenteService,
    private modalCtrl: ModalController,
    private snackbar: SnackbarService,
    private dialog: DialogService,
    private error: ErrorHandlerService) { }

  ngOnInit() { }

  async solicitar(data: any) {
    const actionSheet = await this.action.create({
      header: '¿Está seguro de enviar esta solicitud?',
      buttons: [
        {
          text: 'Continuar',
          role: 'destructive',
          handler: async () => {
            await this.enviarSolicitud(data);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }
  async enviarSolicitud(data: any) {
    const loading = await this.dialog.showLoading({ message: 'Procesando...' });

    try {
      const params = Object.assign(this.data, { salaCcod: data.salaCcod });
      const result = await this.api.solicitarRecuperacionV6(params);

      if (result.success) {
        this.snackbar.showToast('Solicitud registrada correctamente.', 3000, 'success');
        this.modalCtrl.dismiss({ action: 'reload' });
      }
      else if (result.message) {
        this.snackbar.showToast(result.message, 2000, 'danger');
      }
      else {
        this.snackbar.showToast('Su solicutud no pudo ser procesada.', 2000, 'danger');
      }
    }
    catch (error: any) {
      this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }
  }

}
