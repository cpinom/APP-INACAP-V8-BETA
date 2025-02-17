import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import { SolicitarRecuperacionPage } from './solicitar-recuperacion/solicitar-recuperacion.page';
import { DocenteService } from 'src/app/core/services/docente/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import * as moment from 'moment';
import { DialogService } from 'src/app/core/services/dialog.service';
import { DetalleSolicitudPage } from './detalle-solicitud/detalle-solicitud.page';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.page.html',
  styleUrls: ['./recuperacion.page.scss'],
})
export class RecuperacionPage implements OnInit {

  seccion: any;
  data: any;
  mostrarData = false;
  tabsModel = 0;

  constructor(private api: DocenteService,
    private error: ErrorHandlerService,
    private dialog: DialogService,
    private router: Router,
    private routerOutlet: IonRouterOutlet) {
    moment.locale('es');
  }
  ngOnInit() {
    this.seccion = this.router.getCurrentNavigation()?.extras.state;
    this.cargar();
  }
  async cargar() {
    const { seccCcod } = this.seccion;

    try {
      const result = await this.api.getRecuperacionCursoV6(seccCcod);

      if (result.success) {
        this.data = result.data;
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        this.error.handle(error);
      }
    }
    finally {
      this.mostrarData = true;
    }
  }
  formatearFecha(fechaString: string) {
    const fecha = moment(fechaString, 'DD/MM/YYYY');
    return fecha.format('D [de] MMMM, YYYY');
  }
  async solicitarRecuperacion(clase: any) {
    const modal = await this.dialog.showModal({
      component: SolicitarRecuperacionPage,
      componentProps: {
        clase: clase,
        data: this.data
      },
      canDismiss: true,
      presentingElement: this.routerOutlet.nativeEl
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data && result.data.action == 'reload') {
        await this.cargar();
      }
    });
  }
  async detalleSolicitud(data: any) {
    const modal = await this.dialog.showModal({
      component: DetalleSolicitudPage,
      componentProps: {
        data: data,
        seccion: this.seccion
      },
      canDismiss: true,
      presentingElement: this.routerOutlet.nativeEl
    })
  }
  get backUrl() { return this.router.url.replace('/recuperacion', '') }

}

