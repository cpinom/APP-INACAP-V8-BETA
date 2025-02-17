import { Component, inject, OnInit } from '@angular/core';
import * as moment from 'moment';
import { UtilsService } from 'src/app/core/services/utils.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AppLauncher } from '@capacitor/app-launcher';
import { MicrosoftTeamsService } from 'src/app/core/services/http/mteams.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-detalle-evento',
  templateUrl: './detalle-evento.page.html',
  styleUrls: ['./detalle-evento.page.scss'],
})
export class DetalleEventoPage implements OnInit {

  data: any;
  eliminandoEvento = false;

  private api = inject(MicrosoftTeamsService);
  private utils = inject(UtilsService);
  private snackbar = inject(SnackbarService);
  private dialog = inject(DialogService);

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
    let snackbar = await this.snackbar.create('Eliminando...', false, 'secondary');

    this.eliminandoEvento = true;
    await snackbar.present();

    try {
      await this.api.eliminarEvento({ id: this.data.id });
      await this.dialog.dismissModal(true);
    }
    catch (error: any) { }
    finally {
      this.eliminandoEvento = false;
      await snackbar.dismiss();
    }
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
