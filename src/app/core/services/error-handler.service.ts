import { inject, Injectable } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  private authService = inject(AuthService);
  private nav = inject(NavController);
  private alertCtrl = inject(AlertController);
  private modalCtrl = inject(ModalController);

  constructor() { }

  async handle(error?: any, cb?: Function, keepModal?: boolean) {
    debugger
    const currentAlert = await this.alertCtrl.getTop();

    if (currentAlert != null) {
      await currentAlert.dismiss();
    }

    if (error && error.status == 401) {
      await this.authService.clearAuth();
      await this.nav.navigateRoot('publico');
      const alert = await this.alertCtrl.create({
        keyboardClose: false,
        backdropDismiss: false,
        header: 'La sesión ha caducado',
        message: 'Vuelve a iniciar sesión.',
        buttons: ['Aceptar']
      });

      await alert.present();
    }
    else {
      const message = typeof (error) == 'string' ? error : 'El servicio no se encuentra disponible o presenta algunos problemas de cobertura, reintenta en un momento.';
      const alert = await this.alertCtrl.create({
        keyboardClose: false,
        backdropDismiss: false,
        header: 'INACAP',
        message: message,
        buttons: [{
          text: 'Aceptar',
          handler: () => {
            if (cb) cb.call(this);
          }
        }]
      });

      await alert.present();
    }

    keepModal = keepModal == true;

    if (!keepModal) {
      const currentModal = await this.modalCtrl.getTop();

      if (currentModal != null) {
        await currentModal.dismiss();
      }
    }
  }
}
