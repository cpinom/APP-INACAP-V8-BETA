import { Component, inject, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Router } from '@angular/router';
import { AppLauncher } from '@capacitor/app-launcher';
import { IonRouterOutlet, NavController } from '@ionic/angular';
import { DetalleEventoPage } from './detalle-evento/detalle-evento.page';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import * as moment from 'moment';
import { DialogService } from 'src/app/core/services/dialog.service';
import { MicrosoftTeamsService } from 'src/app/core/services/http/mteams.service';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';

enum Tab {
  equipos = '1',
  eventos = '0'
}

@Component({
  selector: 'app-microsoft-teams',
  templateUrl: './microsoft-teams.page.html',
  styleUrls: ['./microsoft-teams.page.scss'],
})
export class MicrosoftTeamsPage implements OnInit {

  eventos!: any[];
  equipos!: any[];
  tabModel = Tab.eventos;
  mostrarData = false;
  hideLoadingSpinner = false;

  private api = inject(MicrosoftTeamsService);
  private utils = inject(UtilsService);
  private router = inject(Router);
  private dialog = inject(DialogService);
  private routerOutlet = inject(IonRouterOutlet);
  private nav = inject(NavController);
  private error = inject(ErrorHandlerService);

  constructor() { }

  async ngOnInit() {
    await this.cargar();
    this.api.marcarVista(this.Vista);
  }
  recargar(e: any) {
    this.cargar(true).finally(() => {
      e && e.target.complete();
    });
  }
  async cargar(forzar?: boolean) {
    try {
      let eventos = await this.api.getStorage('eventos');

      if (eventos && !forzar) {
        this.eventos = eventos;
      }
      else {
        this.eventos = await this.api.getEventos();
      }

      await this.api.setStorage('eventos', this.eventos);
    }
    catch (error: any) {
      this.nav.navigateBack(this.backUrl)
      this.error.handle(error);
      return;
    }
    finally {
      this.hideLoadingSpinner = true;
      this.mostrarData = true;
    }
  }
  async detalleEvento(data: any) {
    const modal = await this.dialog.showModal({
      component: DetalleEventoPage,
      componentProps: {
        data: data
      },
      presentingElement: this.routerOutlet.nativeEl
    });

    modal.onWillDismiss().then(async (result: any) => {
      if (result.data) {
        await this.cargar(true);
      }
    });

    await modal.present();
  }
  async unirseTap(evento: any) {
    const appUrl = evento.url;
    try {
      await AppLauncher.openUrl({ url: appUrl });
    }
    catch {
      await this.utils.openLink(appUrl);
    }
  }
  async appTap() {
    const appUrl = 'https://teams.microsoft.com/';
    // const result = await AppLauncher.canOpenUrl({ url: appUrl });

    try {
      await AppLauncher.openUrl({ url: appUrl });
    }
    catch {
      this.utils.openLink(appUrl);
    }
  }
  resolverFecha(fecha: any) {
    return moment(fecha.inicio).format('DD/MM/YYYY') + ' ' + moment(fecha.inicio).format('HH:mm') + ' - ' + moment(fecha.fin).format('HH:mm');
  }
  get backUrl() { return this.router.url.replace('/microsoft-teams', ''); }
  get Vista() { return this.router.url.startsWith('/alumno') ? VISTAS_ALUMNO.MICROSOFTTEAMS : VISTAS_DOCENTE.MICROSOFTTEAMS; }

}
