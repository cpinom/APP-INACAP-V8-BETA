import { Component, inject, Input, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';
import { DetalleOpinionComponent } from './detalle-opinion/detalle-opinion.component';
import { NuevaOpinionComponent } from './nueva-opinion/nueva-opinion.component';
import { ErrorHandlerService } from '../../services/error-handler.service';
import * as moment from 'moment';
import { DialogService } from '../../services/dialog.service';
import { BuzonOpinionService } from '../../services/http/buzonopinion.service';

@Component({
  selector: 'buzon-opinion-comp',
  templateUrl: './buzon-opinion.component.html',
  styleUrls: ['./buzon-opinion.component.scss']
})
export class BuzonOpinionComponent implements OnInit {

  @Input('rol') rol!: string;
  sugerencias: any;
  mostrarData = false;
  mostrarCargando = true;

  private api = inject(BuzonOpinionService);
  private error = inject(ErrorHandlerService);
  private dialog = inject(DialogService);
  private routerOutlet = inject(IonRouterOutlet);

  constructor() {
    moment.locale('es');
  }
  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    const esreCcod = '0';
    const tuserCcod = this.tipoUsuario;
    const start = 0;
    const limit = 30;
    const order = '0';
    const search = '';

    try {
      const result = await this.api.getOpinionesV6(esreCcod, tuserCcod, start, limit, order, search);

      if (result.success) {
        this.sugerencias = result.data.opiniones;
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        this.error.handle(error);
      }
    }
    finally {
      this.mostrarData = true;
      this.mostrarCargando = false;
    }
  }
  async recargar() {
    this.mostrarData = false;
    this.mostrarCargando = true;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  async nuevaOpinion() {
    let principal = await this.api.getStorage('principal');

    if (!principal) {
      const loading = await this.dialog.showLoading({ message: 'Cargando...' });

      try {
        const result = await this.api.getPrincipalV6();

        if (result.success) {
          principal = result.data;
          await this.api.setStorage('principal', principal);
        }
      }
      catch (error: any) {
        if (error && error.status == 401) {
          this.error.handle(error);
        }
      }
      finally {
        await loading.dismiss();
      }
    }

    if (principal) {
      const data = Object.assign(principal, { rol: this.rol, tipoUsuario: this.tipoUsuario });

      const modal = await this.dialog.showModal({
        component: NuevaOpinionComponent,
        componentProps: data,
        presentingElement: this.routerOutlet.nativeEl
      });

      modal.onWillDismiss().then(result => {
        if (result.data === true) {
          this.cargar();
        }
      })
    }
  }
  async detalleOpinion(resoNcorr: any) {
    const loading = await this.dialog.showLoading({ message: 'Cargando...' });
    let data: any;

    try {
      const request = await this.api.getDetalleOpinionV6(resoNcorr, this.tipoUsuario);

      if (request.success) {
        data = request.data;
        data.resoTsugerencia = data.resoTsugerencia.replace(/(?:\r\n|\r|\n)/g, '<br>');
        data.resoTrespuesta = data.resoTrespuesta ? data.resoTrespuesta.replace(/(?:\r\n|\r|\n)/g, '<br>') : '';
      }
    }
    catch (error: any) {
      this.error.handle(error);
      return;
    }
    finally {
      await loading.dismiss();
    }

    if (data) {
      const modal = await this.dialog.showModal({
        component: DetalleOpinionComponent,
        componentProps: {
          data: data
        },
        presentingElement: this.routerOutlet.nativeEl
      });
    }
  }
  formatFecha(fechaString: string) {
    const fecha = moment(fechaString, 'DD/MM/YYYY');
    return fecha.format('D [de] MMMM, YYYY');
  }
  get tipoUsuario() {
    return this.rol == 'alumno' ? '1' : '2';
  }
  get backPath() {
    return this.rol == 'alumno' ? '/dashboard-alumno/dae' : '/dashboard-docente/servicios';
  }

}

