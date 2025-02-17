import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { ReservasEspacioService } from 'src/app/core/services/reservas-espacio.service';

declare const QRCode: any;

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.page.html',
  styleUrls: ['./detalle-reserva.page.scss'],
})
export class DetalleReservaPage implements OnInit {

  @ViewChild('qrcode') qrcode: ElementRef;
  mostrarCargando = true;
  mostrarData = false;
  id: any;
  data: any;
  mostrarSuccess = false;

  constructor(private api: ReservasEspacioService,
    private router: Router,
    private action: ActionSheetController,
    private loading: LoadingController,
    private alertCtrl: AlertController,
    private events: EventsService,
    private error: ErrorHandlerService) { }

  ngOnInit() {
    const params = this.router.getCurrentNavigation().extras.state;

    if (params) {
      this.id = params['id'];
      this.mostrarSuccess = params['mostrarSuccess'] === true;
      this.cargar();
    }
  }
  generarCodigoQR() {
    if (!this.data) {
      return;
    }

    if (!this.data.ticket_code) {
      return;
    }

    const options = {
      text: this.data.ticket_code,
      width: 140,
      height: 140,
      correctLevel: QRCode.CorrectLevel.H
    }

    new QRCode(this.qrcode.nativeElement, options);
  }
  async cargar() {
    const params = { id: this.id };

    try {
      const result = await this.api.getDetalleReserva(params);

      if (result.success) {
        this.data = result.data;
        this.generarCodigoQR();
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
  async cancelar() {
    const confirm = await this.confirmarEliminar();

    if (confirm) {
      const loading = await this.loading.create({ message: 'Cargando...' });

      await loading.present();

      try {
        const result = await this.api.cancelarReserva({ id: this.id });

        if (result.success) {
          this.presentSuccess();
          this.events.app.next({ action: 'app:reserva-espacios-reload' });
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
        await loading.dismiss();
      }
    }
  }
  confirmarEliminar(): Promise<boolean> {
    return new Promise((resolve) => {
      this.action.create({
        header: 'Cancelar Reserva',
        subHeader: '¿Esta seguro que desea cancelar la reserva?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => resolve(false)
          }, {
            text: 'Continuar',
            role: 'destructive',
            handler: () => resolve(true)
          }
        ]
      }).then(action => action.present());
    })
  }
  async presentSuccess() {
    const mensaje = 'La reserva ha sido cancelada correctamente.'
    const alert = await this.alertCtrl.create({
      keyboardClose: false,
      backdropDismiss: false,
      header: 'Cancelar Reserva.',
      cssClass: 'success-alert',
      message: '<div class="image"><img src = "./assets/images/icon_check_circle.svg" width="35px" height="35px"></div>' + mensaje,
      buttons: [
        {
          text: 'Aceptar',
          handler: async () => {
            this.router.navigate([this.backUrl]);
          }
        }
      ]
    });

    await alert.present();
  }
  resolverFecha(fecha: string) {
    return moment(fecha, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')// "2024-02-27 10:00:00"
  }
  resolverHora(fecha: string) {
    return moment(fecha, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')
  }
  get backUrl() {
    return this.router.url.replace('/detalle-reserva', '');
  }

}
