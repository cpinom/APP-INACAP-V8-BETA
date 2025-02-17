import { Component, inject, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';
import { DocenteService } from 'src/app/core/services/docente/docente.service';
import { SolicitarRecuperacionPage } from '../../cursos/curso/recuperacion/solicitar-recuperacion/solicitar-recuperacion.page';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import * as moment from 'moment';
import { DialogService } from 'src/app/core/services/dialog.service';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';

@Component({
  selector: 'app-recuperacion-clases',
  templateUrl: './recuperacion-clases.page.html',
  styleUrls: ['./recuperacion-clases.page.scss'],
})
export class RecuperacionClasesPage implements OnInit {

  data: any;
  mostrarData = false;
  activeTab = 0;
  mostrarCargando = true;

  private api = inject(DocenteService);
  private dialog = inject(DialogService);
  private routerOutlet = inject(IonRouterOutlet);
  private error = inject(ErrorHandlerService);

  constructor() {
    moment.locale('es');
  }

  async ngOnInit() {
    await this.cargar();
    this.api.marcarVista(VISTAS_DOCENTE.RECUPERACIONES);
  }
  async cargar() {
    try {
      let result = await this.api.getRecuperacionClasesV5();

      if (result.success) {
        this.data = result.data;
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error.status == 401) {
        this.error.handle(error);
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  tabsChanged(e: any) {
    this.activeTab = e.detail.value == '0' ? 0 : 1;
  }
  async solicitarRecuperacion(data: any) {
    let clase = data.recuperacion;

    clase['ssecNcorr'] = data.ssecNcorr;

    await this.dialog.showModal({
      component: SolicitarRecuperacionPage,
      componentProps: { clase: clase, data: null },
      presentingElement: this.routerOutlet.nativeEl
    });
  }
  formatFecha(fechaString: string) {
    const d = new Date(fechaString);
    const fecha = moment(fechaString);
    return fecha.format('D [de] MMMM, YYYY');
  }
  get mostrarContador() {
    if (this.data && this.mostrarData) {
      return this.data.recuperaciones && this.data.recuperaciones.length > 5;
    }
    return false;
  }
}

