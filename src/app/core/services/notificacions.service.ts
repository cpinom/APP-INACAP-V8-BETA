import { inject, Injectable } from '@angular/core';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';
import { EventsService } from './events.service';
import { PublicService } from './http/public.service';

@Injectable({
  providedIn: 'root'
})
export class NotificactionsService {

  private api = inject(PublicService);
  private events = inject(EventsService);

  constructor() { }

  init() {

    try {

      PushNotifications.addListener('registration', async (token: Token) => {
        try {
          const id = await Device.getId();
          const info = await Device.getInfo();

          console.log(info);
          console.log('registrar token:' + token.value);

          const request = this.api.registrarDispositivo({
            token: token.value,
            plataforma: info.platform,
            modelo: info.model,
            uuid: id.identifier,
            version: info.osVersion,
            aplicacion: 'APP_MOVIL'
          });

          request.then(() => {
            this.events.app.next({ action: 'app:notificaciones-registro' })
          });
        }
        catch (error) {
          console.log('ERROR - [NotificactionsService - registration ]', error);
        }
      });

      PushNotifications.addListener('registrationError', (error: any) => { });

      PushNotifications.checkPermissions().then(async permStatus => {
        try {
          if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
          }

          if (permStatus.receive !== 'granted') {
            console.log('User denied permissions!');
          }

          PushNotifications.register();
        }
        catch (error) {
          console.log('ERROR - [NotificactionsService - checkPermissions ]', error);
        }
      });

    }
    catch (error) {
      console.log('ERROR - [NotificactionsService - init ]', error);
    }

  }

}
