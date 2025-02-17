import { Injectable } from '@angular/core';
import { InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { LoadingController, ModalController } from '@ionic/angular';
import { Global } from 'src/app/app.global';
import { FormasPagoComponent } from '../components/pagos/formas-pago/formas-pago.component';
import { PortalPagosService } from './portalpagos.service';
import { UtilsService } from './utils.service';

interface PagoResult {
  success: boolean,
  tpaoCcod?: number,
  paonNcorr?: number
}

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  constructor(private modalCtrl: ModalController,
    private loading: LoadingController,
    private api: PortalPagosService,
    private global: Global,
    private utils: UtilsService) { }

  async procesarPago(formasPago, pagoId, monto, personaId?, service?, showDetail?: boolean): Promise<PagoResult> {
    const modal = await this.modalCtrl.create({
      component: FormasPagoComponent,
      breakpoints: [0, 0.4, 0.8],
      initialBreakpoint: 0.4,
      handle: false,
      componentProps: {
        formasPago: formasPago,
        pagoId: pagoId,
        montoCarro: monto
      }
    });

    await modal.present();

    const modalResult = await modal.onWillDismiss();

    if (modalResult.data) {
      if (personaId) modalResult.data['persNrut'] = personaId;
      return this.solicitarPago(modalResult.data, service);
    }
    else {
      return Promise.reject({ code: 0, message: 'Cancelado por el Usuario' });
    }

  }
  solicitarPago(params: any, service?: any): Promise<PagoResult> {

    return new Promise(async (resolve, reject) => {
      const loading = await this.loading.create({ id: 'procesa-pago', message: 'Procesando...' });
      const api = service ? service : this.api;

      await loading.present();

      try {
        const result = await api.solicitarPago(params);

        if (result.success) {
          if (params.tpaoCcod != 12) {
            if (this.global.Integration) {
              this.utils.openLink(result.url);

              await this.delay(20000);

              if (confirm('¿Se realizo pago?')) {
                resolve(Object.assign(params, { success: true }));
              }
              else {
                resolve(Object.assign(params, { success: false }));
              }

            }
            else {

              const options: InAppBrowserOptions = {
                toolbar: 'yes',
                toolbarposition: 'bottom',
                toolbarcolor: '#f7f7f7',
                closebuttoncaption: 'Cerrar',
                location: 'no'
              };
              const browser = this.utils.openInAppLink(result.url, options);

              browser.on('loadstart').subscribe(event => {
                console.log('loadstart');
                console.log(event.url);

                if ((event.url).indexOf(`action=end`) > -1) {
                  browser.close();
                }

                if ((event.url).indexOf(`action=success`) > -1) {
                  browser.close();
                  resolve(Object.assign(params, { success: true }));
                }

                if ((event.url).indexOf(`action=error`) > -1) {
                  browser.close();
                  resolve(Object.assign(params, { success: false }));
                }
              });

              browser.on('exit').subscribe(event => {
                console.log('exit');
                console.log(event);

                // this.zone.run(() => {

                //   setTimeout(() => {
                //     StatusBar.setStyle({ style: Style.Dark });
                //   }, 1000);
                // });
              });

            }
          }
          else {
            await this.utils.openLink(result.url);
            resolve({ success: true });
          }
        }
        else {
          reject({ code: 1, message: result.message });
        }
      }
      catch (error) {
        reject({ code: 2, message: 'Error en comunicación con el servidor.', error: error });
      }
      finally {
        await loading.dismiss();
      }
    })

  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}

export function getRouterOutlet() {
  return document.getElementById('ion-router-outlet-content');
}