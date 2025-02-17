import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-solicitud-detalle',
  templateUrl: './solicitud-detalle.page.html',
  styleUrls: ['./solicitud-detalle.page.scss'],
})
export class SolicitudDetallePage implements OnInit {

  data: any

  constructor(private modalCtrl: ModalController,
    private utils: UtilsService) { }

  ngOnInit() { }
  async cerrar() {
    await this.modalCtrl.dismiss();
  }
  async descargar(url) {
    if (!url) return;
    await this.utils.openLink(url);
  }
  async anular() {
    await this.modalCtrl.dismiss({ anular: true });
  }

}
