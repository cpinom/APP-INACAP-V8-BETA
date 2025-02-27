import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Router } from '@angular/router';
import { AppLauncher } from '@capacitor/app-launcher';
import { IonInfiniteScroll, IonRouterOutlet } from '@ionic/angular';
import { DetalleEventoPage } from './detalle-evento/detalle-evento.page';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import * as moment from 'moment';
import { DialogService } from 'src/app/core/services/dialog.service';
import { MicrosoftTeamsService } from 'src/app/core/services/http/mteams.service';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';

@Component({
  selector: 'app-microsoft-teams',
  templateUrl: './microsoft-teams.page.html',
  styleUrls: ['./microsoft-teams.page.scss'],
})
export class MicrosoftTeamsPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteItem!: IonInfiniteScroll;
  eventos!: any[];
  mostrarData = false;
  mostrarCargando = true;
  pageSize = 30;
  skip = 0;

  private api = inject(MicrosoftTeamsService);
  private utils = inject(UtilsService);
  private router = inject(Router);
  private dialog = inject(DialogService);
  private routerOutlet = inject(IonRouterOutlet);
  private error = inject(ErrorHandlerService);

  constructor() { }

  async ngOnInit() {
    await this.cargar();
    this.api.marcarVista(this.Vista);
  }
  recargar(e?: any) {
    this.mostrarCargando = e ? false : true;
    this.mostrarData = false;
    this.skip = 0;
    this.pageSize = 30;
    this.eventos = [];
    this.cargar().finally(() => {
      e && e.target.complete();
    });
  }
  async cargar() {
    try {
      const result = await this.api.getEventos(this.pageSize, this.skip);

      if (result.success) {
        if (!this.eventos) {
          this.eventos = result.eventos;
        }
        else {
          this.eventos = [...this.eventos, ...result.eventos];
        }

        if (this.infiniteItem) {
          this.infiniteItem.disabled = !(result.eventos.length == this.pageSize);
        }
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        this.error.handle(error);
        return;
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  loadData(e: any) {
    this.skip = this.pageSize + this.skip;
    this.cargar().finally(() => {
      e.target.complete();
    });
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
        this.recargar();
      }
    });
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

    try {
      await AppLauncher.openUrl({ url: appUrl });
    }
    catch {
      await this.utils.openLink(appUrl);
    }
  }
  resolverFecha(fecha: any) {
    return moment(fecha.inicio).format('DD/MM/YYYY') + ' ' + moment(fecha.inicio).format('HH:mm') + ' - ' + moment(fecha.fin).format('HH:mm');
  }
  get backUrl() { return this.router.url.replace('/microsoft-teams', ''); }
  get Vista() { return this.router.url.startsWith('/dashboard-alumno') ? VISTAS_ALUMNO.MICROSOFTTEAMS : VISTAS_DOCENTE.MICROSOFTTEAMS; }

}
