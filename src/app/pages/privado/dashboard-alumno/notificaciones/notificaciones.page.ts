import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Device } from '@capacitor/device';
import { ActionSheetController } from '@ionic/angular';
import moment, { unitOfTime } from 'moment';
import { Subscription } from 'rxjs';
import { AppGlobal } from 'src/app/app.global';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit, OnDestroy {

  private dialog = inject(DialogService);
  private events = inject(EventsService);
  private global = inject(AppGlobal);
  private profile = inject(ProfileService);
  private api = inject(AlumnoService);
  private error = inject(ErrorHandlerService);
  private snackbar = inject(SnackbarService);
  private action = inject(ActionSheetController);

  mostrarCargando = true;
  mostrarEmpty = false;
  mostrarData = false;
  subscription: Subscription;
  notificaciones: any;

  constructor() {
    moment.locale('es');

    this.subscription = this.events.app.subscribe((event: any) => {
      if (event.action == 'app:alumno-notificaciones-recibida') {
        this.mostrarCargando = true;
        setTimeout(() => {
          this.cargar();
          this.global.NotificationFlag = false;
        }, 100)
      }
    });
  }
  async ngOnInit() {
    await this.cargar();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  async cargar() {
    try {
      const info = await Device.getId();
      const npreTuuid = info.identifier || 'web';
      const principal = await this.profile.getStorage('principal');
      const programa = principal.programas[principal.programaIndex];
      const result = await this.api.getNotificaciones(programa.sedeCcod, npreTuuid);

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
        await this.error.handle(error);
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  async recargar() {
    this.mostrarEmpty = false;
    this.mostrarCargando = true;
    this.mostrarData = false;
    await this.cargar();
  }
  procesarNotificaciones(data: any[]) {
    let nuevas: any[] = [];
    let semanales: any[] = [];
    let mensuales: any[] = [];
    let antiguas: any[] = [];

    data.forEach(item => {
      let fechaEnvio = moment(item.apnaFcreacion, 'DD/MM/YYYY HH:mm');
      let primerDiaSemana = moment().startOf('isoweek' as unitOfTime.StartOf);
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
  }
  resolverIcon(aptnCcod: number) {
    switch (aptnCcod) {
      case 1:
        return 'notas';
      case 2:
        return 'home';
      case 3:
        return 'payment';
      case 7:
        return 'error';
      case 8:
        return 'assignment';
      default:
        return 'star';
    }
  }
  resolverCss(tinpCcod: number) {
    switch (tinpCcod) {
      case 1:
        return 'notas';
      case 2:
        return 'bienvenida';
      case 3:
        return 'pagos';
      case 7:
        return 'avisos';
      case 8:
        return 'solicitudes';
      default:
        return '';
    }
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
    const npreTuuid = info.identifier || 'web';
    const principal = await this.profile.getStorage('principal');
    const programa = principal.programas[principal.programaIndex];
    const message = await this.snackbar.create('Eliminando...', false);

    message.present();

    try {
      const params = {
        tipo: item.tipo,
        apnaNcorr: item.apnaNcorr,
        sedeCcod: programa.sedeCcod,
        npreTuuid: npreTuuid
      }
      const result = await this.api.eliminarNotificacion(params);

      await message.dismiss();

      if (result.success) {
        this.procesarNotificaciones(result.data.notificaciones);
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      await this.error.handle(error);
    }
    finally {
      message.dismiss();
    }
  }
  async eliminarTodasNotificaciones() {
    const info = await Device.getId();
    const npreTuuid = info.identifier || 'web';
    const principal = await this.profile.getStorage('principal');
    const programa = principal.programas[principal.programaIndex];
    const message = await this.snackbar.create('Eliminando...', false);

    await message.present();

    try {
      const params = {
        sedeCcod: programa.sedeCcod,
        npreTuuid: npreTuuid
      };
      const result = await this.api.eliminarTodasNotificaciones(params);

      await message.dismiss();

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
      message.dismiss();
    }
  }
  async cerrar() {
    await this.dialog.dismissModal();
  }

}
