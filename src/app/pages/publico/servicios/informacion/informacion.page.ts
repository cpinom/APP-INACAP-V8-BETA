import { Component, inject, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import * as moment from 'moment';
import { AppGlobal } from 'src/app/app.global';
import { PublicService } from 'src/app/core/services/http/public.service';
import { VISTAS } from 'src/app/core/constants/publico';
import { ModalCondicionesPage } from './modal-condiciones/modal-condiciones.page';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {

  private global = inject(AppGlobal);
  private utils = inject(UtilsService);
  private api = inject(PublicService);
  private routerOutlet = inject(IonRouterOutlet);
  private pt = inject(Platform);
  private dialog = inject(DialogService);

  constructor() { }

  ngOnInit() {
    this.api.marcarVistaPublica(VISTAS.VERSION_APP);
  }
  async condiciones() {
    await this.dialog.showModal({
      component: ModalCondicionesPage,
      canDismiss: true,
      presentingElement: this.routerOutlet.nativeEl
    })
  }
  politicas() {
    this.abrirNavegador('https://portal.inacap.cl/politicas-de-privacidad');
  }
  calificar() {
    if (this.pt.is('ios')) {
      this.abrirNavegador('https://apps.apple.com/cl/app/inacap-m%C3%B3vil-app/id1175403829')
    }
    else {
      this.abrirNavegador('https://play.google.com/store/apps/details?id=com.inacap.push&hl=es_CL')
    }
  }
  abrirNavegador(url: string) {
    this.utils.openLink(url);
  }
  get version() { return this.global.Version; }
  get compilacion() { return this.global.Compilation; }
  get ambiente() { return this.global.Environment; }
  get ano() { return moment().format('YYYY'); }

}

