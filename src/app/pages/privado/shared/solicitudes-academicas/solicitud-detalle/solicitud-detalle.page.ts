import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-solicitud-detalle',
  templateUrl: './solicitud-detalle.page.html',
  styleUrls: ['./solicitud-detalle.page.scss'],
})
export class SolicitudDetallePage implements OnInit {

  data: any;

  private dialog = inject(DialogService);
  private utils = inject(UtilsService);

  constructor() { }

  ngOnInit() { }
  async cerrar() {
    await this.dialog.dismissModal();
  }
  async descargar(url: string) {
    if (!url) return;
    await this.utils.openLink(url);
  }
  async anular() {
    await this.dialog.dismissModal({ anular: true });
  }

}
