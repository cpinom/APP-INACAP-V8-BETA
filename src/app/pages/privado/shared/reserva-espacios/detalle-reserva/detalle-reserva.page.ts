import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { ReservasEspacioService } from 'src/app/core/services/http/reservas-espacio.service';

declare const QRCode: any;

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.page.html',
  styleUrls: ['./detalle-reserva.page.scss'],
})
export class DetalleReservaPage implements OnInit {

  @ViewChild('qrcode') qrcode!: ElementRef;
  mostrarCargando = true;
  mostrarData = false;
  id: any;
  data: any;
  mostrarSuccess = false;

  private api = inject(ReservasEspacioService);
  private router = inject(Router);
  private action = inject(ActionSheetController);
  private dialog = inject(DialogService);
  private events = inject(EventsService);
  private error = inject(ErrorHandlerService);


  constructor() { }

  ngOnInit() {
    const params = this.router.getCurrentNavigation()?.extras.state;

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
      if (error && error.status == 401) {
        await this.error.handle(error);
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
      const loading = await this.dialog.showLoading({ message: 'Cargando...' });

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
        if (error && error.status == 401) {
          await this.error.handle(error);
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

    await this.dialog.showAlert({
      keyboardClose: false,
      backdropDismiss: false,
      header: 'Cancelar Reserva.',
      cssClass: 'success-alert',
      message: `<div class="image"><ion-icon src = "./assets/icon/check_circle.svg"></ion-icon></div>${mensaje}`,
      buttons: [
        {
          text: 'Aceptar',
          handler: async () => {
            this.router.navigate([this.backUrl]);
          }
        }
      ]
    });
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
