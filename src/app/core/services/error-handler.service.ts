import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
// import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    /*private auth: AuthService*/) { }

  handle(error?: any, cb?: Function, keepModal?: boolean) {
    debugger
    /*this.alertCtrl.getTop().then(current => {
      if (current != null) {
        current.dismiss();
      }

      if (error && error.status == 401) {
        this.auth.clearAuth(true);
        this.router.navigate(['/publico/inicio'], { replaceUrl: true });
        this.alertCtrl.create({
          keyboardClose: false,
          backdropDismiss: false,
          header: 'La sesión ha caducado',
          message: 'Vuelve a iniciar sesión.',
          buttons: ['Aceptar']
        }).then(alert => alert.present());
      }
      else {
        let message = typeof (error) == 'string' ? error : 'El servicio no se encuentra disponible o presenta algunos problemas de cobertura, reintenta en un momento.';
        this.alertCtrl.create({
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
        }).then(alert => alert.present());
      }
    });

    keepModal = keepModal == true;

    if (!keepModal) {
      this.modalCtrl.getTop().then(current => {
        if (current != null) {
          current.dismiss();
        }
      });
    }*/
  }
}
