import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Device } from '@capacitor/device';
import { ActionSheetController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AppGlobal } from 'src/app/app.global';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit, OnDestroy {

  private api = inject(DocenteService);
  private profile = inject(ProfileService);
  private global = inject(AppGlobal);
  private error = inject(ErrorHandlerService);
  private modalCtrl = inject(ModalController);
  private events = inject(EventsService);
  private snackbar = inject(SnackbarService);
  private action = inject(ActionSheetController);
  notificaciones: any;
  mostrarData = false;
  mostrarEmpty = false;
  mostrarCargando = true;
  subscription: Subscription;

  constructor() {
    moment.locale('es');

    this.subscription = this.events.app.subscribe((event: any) => {
      if (event.action == 'app:docente-notificaciones-recibida') {
        debugger
        this.mostrarCargando = true;
        setTimeout(() => {
          this.cargar();
          this.global.NotificationFlag = false;
        }, 100)
      }
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  async ngOnInit() {
    await this.cargar();
    this.api.marcarVista(VISTAS_DOCENTE.NOTIFICACIONES);
  }
  async cargar() {
    debugger
    try {
      const info = await Device.getId();
      const npreTuuid = info.uuid || 'web';
      const principal = await this.profile.getStorage('principal');
      const result = await this.api.getNotificacionesV6(principal.sedeCcod, npreTuuid);

      if (result.success) {
        this.procesarNotificaciones(result.data.notificaciones);
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      this.mostrarEmpty = true;

      if (error && error.status == 401) {
        this.error.handle(error);
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  recargar() {
    this.mostrarEmpty = false;
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar()
    }, 500);
  }
  procesarNotificaciones(data: any[]) {
    let nuevas: any[] = [];
    let semanales: any[] = [];
    let mensuales: any[] = [];
    let antiguas: any[] = [];

    data.forEach(item => {
      let fechaEnvio = moment(item.apndFcreacion, 'DD/MM/YYYY HH:mm');
      let primerDiaSemana = moment().startOf('isoweek' as moment.unitOfTime.StartOf);
      let primerDiaMes = moment().startOf('month');
      let esHoy = fechaEnvio.isSame(new Date(), 'day');
      let esAyer = fechaEnvio.isSame(moment().subtract(1, 'day'), 'day');

      if (esHoy || esAyer) {
        nuevas.push(item);
      }
      else if (fechaEnvio.isSameOrAfter(primerDiaSemana)) {
        semanales.push(item);
      }
      else if (fechaEnvio.isSameOrAfter(primerDiaMes)) {
        mensuales.push(item);
      }
      else {
        antiguas.push(item);
      }
    });

    this.notificaciones = {};
    this.notificaciones[0] = nuevas;
    this.notificaciones[1] = semanales;
    this.notificaciones[2] = mensuales;
    this.notificaciones[3] = antiguas;
    this.mostrarEmpty = !nuevas.length && !semanales.length && !mensuales.length && !antiguas.length;
    // this.mostrarData = true;
  }
  resolverCss(tinpCcod?: any) {
    return 'icon-yellow';
  }
  resolverIcon(tinpCcod?: any) {
    return 'assets/icon/star.svg';
  }
  async acciones(item: any) {
    const actionSheet = await this.action.create({
      header: item.nopeTitulo,
      buttons: [
        {
          text: 'Eliminar esta notificación',
          role: 'destructive',
          handler: async () => {
            await this.eliminarNotificacion(item);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }
  async eliminarNotificacion(item: any) {
    const info = await Device.getId();
    const npreTuuid = info.uuid || 'web';
    const principal = await this.profile.getStorage('principal');
    const message = await this.snackbar.create('Eliminando...', false);

    await message.present();

    try {
      const params = {
        tipo: item.tipo,
        apndNcorr: item.apndNcorr,
        sedeCcod: principal.sedeCcod,
        npreTuuid: npreTuuid
      };
      const result = await this.api.eliminarNotificacionV6(params);

      if (result.success) {
        this.procesarNotificaciones(result.data.notificaciones);
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      this.error.handle(error);
    }
    finally {
      await message.dismiss();
    }
  }
  async eliminarTodasNotificaciones() {
    const info = await Device.getId();
    const npreTuuid = info.uuid || 'web';
    const principal = await this.profile.getStorage('principal');
    const message = await this.snackbar.create('Eliminando...', false);

    await message.present();

    try {
      let params = {
        sedeCcod: principal.sedeCcod,
        npreTuuid: npreTuuid
      }
      const result = await this.api.eliminarTodasNotificacionesV6(params);

      if (result.success) {
        this.procesarNotificaciones(result.data.notificaciones);
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      this.error.handle(error);
    }
    finally {
      await message.dismiss();
    }
  }
  async cerrar() {
    await this.modalCtrl.dismiss();
  }

}
