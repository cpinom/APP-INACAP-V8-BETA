import { Component, inject, OnInit } from '@angular/core';
import * as moment from 'moment';
import { UtilsService } from 'src/app/core/services/utils.service';
import { AppLauncher } from '@capacitor/app-launcher';
import { MicrosoftTeamsService } from 'src/app/core/services/http/mteams.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-detalle-evento',
  templateUrl: './detalle-evento.page.html',
  styleUrls: ['./detalle-evento.page.scss'],
})
export class DetalleEventoPage implements OnInit {

  data: any;

  private api = inject(MicrosoftTeamsService);
  private utils = inject(UtilsService);
  private dialog = inject(DialogService);
  private error = inject(ErrorHandlerService);
  private snackbar = inject(SnackbarService);

  constructor() {
    moment.locale('es');
  }
  ngOnInit() { }
  async unirseTap() {
    try {
      await AppLauncher.openUrl({ url: this.data.url })
    }
    catch {
      await this.utils.openLink(this.data.url);
    }
  }
  async eliminar() {
    const confirmar = await this.confirmarEliminar();

    if (!confirmar) {
      return;
    }

    const loading = await this.dialog.showLoading({ message: 'Eliminando evento...' });

    try {
      const result = await this.api.eliminarEvento(this.data.id);

      if (result.success) {
        await loading.dismiss();
        await this.dialog.dismissModal(true);
      }
      else {
        throw new Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }

      await this.snackbar.showToast('No se pudo eliminar el evento', 300, 'danger');
    }
    finally {
      await loading.dismiss();
    }
  }
  async confirmarEliminar() {
    return new Promise(async (resolve) => {
      await this.dialog.showAlert({
        header: 'Eliminar evento',
        message: '¿Estás seguro de que deseas eliminar este evento?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: 'Aceptar',
            role: 'destructive',
            handler: () => resolve(true)
          }
        ]
      });
    });
  }
  async cerrar() {
    await this.dialog.dismissModal();
  }
  get fechaEvento() {
    if (this.data) {
      return moment(this.data.fecha.inicio).format('dddd, DD [de] MMMM [de] YYYY')
    }
    return '';
  }
  get horaEvento() {
    if (this.data) {
      return moment(this.data.fecha.inicio).format('HH:mm') + ' - ' + moment(this.data.fecha.fin).format('HH:mm')
    }
    return '';
  }

}
