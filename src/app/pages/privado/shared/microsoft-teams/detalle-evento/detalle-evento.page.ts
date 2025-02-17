import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { MicrosoftTeamsService } from 'src/app/core/services/mteams.service';
import { UtilsService } from 'src/app/core/services/utils.service';
// import { Share } from '@capacitor/share';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { AppLauncher } from '@capacitor/app-launcher';

@Component({
  selector: 'app-detalle-evento',
  templateUrl: './detalle-evento.page.html',
  styleUrls: ['./detalle-evento.page.scss'],
})
export class DetalleEventoPage implements OnInit {

  data: any;
  eliminandoEvento = false;

  constructor(private modalCtrl: ModalController,
    private api: MicrosoftTeamsService,
    private utils: UtilsService,
    private snackbar: SnackbarService) {
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

  // async compartirTap() {
  //   await Share.share({
  //     //title: 'See cool stuff',
  //     //text: 'Really awesome thing you need to see right meow',
  //     url: this.data.url,
  //     // dialogTitle: 'Share with buddies',
  //   });
  // }

  async eliminar() {
    let snackbar = await this.snackbar.create('Eliminando...', false, 'secondary');

    this.eliminandoEvento = true;
    await snackbar.present();

    try {
      await this.api.eliminarEvento({ id: this.data.id });
      await this.modalCtrl.dismiss(true);
    }
    catch (error) { }
    finally {
      this.eliminandoEvento = false;
      await snackbar.dismiss();
    }
  }

  async cerrar() {
    await this.modalCtrl.dismiss();
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
