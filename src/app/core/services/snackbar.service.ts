import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  duration: number = 3000

  constructor(private toast: ToastController) { }

  async showToast(message: string, duration?: number, color?: string, callback?: Function) {
    const currentToast = await this.toast.getTop();

    currentToast?.dismiss();

    const toast = await this.toast.create({
      message: message,
      duration: duration || this.duration,
      color: color ? color : 'dark',
      keyboardClose: true,
      buttons: [{
        text: 'Cerrar',
        side: 'end',
        handler() {
          callback && callback();
        },
      }]
    });

    await toast.present();

    return toast;
  }

  hide() {
    // this.snackBar.dismiss();
  }

  async showNotification(header: string, message: string, callback: Function) {
    const currentToast = await this.toast.getTop();

    if (currentToast) {
      await currentToast.dismiss();
    }

    const toast = await this.toast.create({
      header: header,
      message: message,
      color: 'dark',
      position: 'top',
      buttons: [{
        role: 'cancel',
        text: 'Ver',
        handler: () => {
          callback && callback();
        }
      }],
      duration: 6000
    });

    await toast.present();

    return toast;
  }

  async create(message: string, closable: boolean, color?: string) {
    this.toast.getTop().then(currentToast => {
      currentToast && currentToast.dismiss();
    });

    const buttons = closable ? [{
      role: 'cancel',
      icon: 'close',
      handler: () => { }
    }] : [];

    const toast = await this.toast.create({
      message: message,
      color: color || 'dark',
      buttons: buttons,
      //duration: 3000
    });

    return toast;
  }
}
