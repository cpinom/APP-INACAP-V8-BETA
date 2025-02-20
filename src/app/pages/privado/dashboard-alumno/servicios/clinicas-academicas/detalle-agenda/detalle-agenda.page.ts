import { Component, inject, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ClinicasAcademicasService } from 'src/app/core/services/http/clinicas-academicas.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-detalle-agenda',
  templateUrl: './detalle-agenda.page.html',
  styleUrls: ['./detalle-agenda.page.scss'],
})
export class DetalleAgendaPage implements OnInit {

  data: any;
  mostrarCancelar = false;

  private api = inject(ClinicasAcademicasService);
  private dialog = inject(DialogService);
  private snackbar = inject(SnackbarService);
  private error = inject(ErrorHandlerService);

  constructor() { }

  ngOnInit() {
    console.log(this.data);
    this.mostrarCancelar = this.data.acesCcod == 2;
  }
  async cancelarAgenda() {
    const observaciones = await this.confirmar();
    const forbiddenPattern = /[<>\/\\"'%;(){}$]/;

    if (observaciones == null) {
      return;
    }

    if (forbiddenPattern.test(observaciones)) {
      this.snackbar.showToast('El comentario contiene caracteres no permitidos.');
      return;
    }

    if (observaciones) {
      const loading = await this.dialog.showLoading({ message: 'Cancelando Reserva...' });
      const params = {
        acagNcorr: this.data.acagNcorr,
        acofNcorr: this.data.acofNcorr,
        acagTobservaciones: observaciones
      };

      try {
        const request = await this.api.cancelarAgenda(params);

        if (request.success) {
          this.dialog.dismissModal(true);
          this.mostrarExito();
        }
      }
      catch (error: any) {
        this.error.handle(error);
      }
      finally {
        await loading.dismiss();
      }
    }
    else {
      this.snackbar.showToast('Debes escribir un comentario para cancelar la reserva.');
    }
  }
  confirmar(): Promise<string | null> {
    return new Promise(async (resolve) => {
      await this.dialog.showAlert({
        header: 'Cancelar Reserva',
        subHeader: 'Escribe un comentario',
        cssClass: 'cancelar-agenda-alert',
        inputs: [{
          name: 'comment',
          type: 'textarea',
          placeholder: 'Escribe el comentario aquí...',
        }],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(null)
          },
          {
            text: 'Continuar',
            role: 'destructive',
            handler: (data) => resolve(data.comment)
          }
        ]
      })
    })
  }
  async mostrarExito() {
    const mensaje = 'La clínica ha sido cancelada correctamente.'

    await this.dialog.showAlert({
      keyboardClose: false,
      backdropDismiss: false,
      header: 'Cancelar Reserva.',
      cssClass: 'success-alert',
      message: `<div class="image"><img src = "./assets/images/icon_check_circle.svg" width="35px" height="35px"></div>${mensaje}`,
      buttons: ['Aceptar']
    });
  }
  async cerrar() {
    await this.dialog.dismissModal();
  }
  get participantes() {
    if (this.data) {
      const participantes = JSON.parse(this.data.participantes);

      return participantes.map((t: any) => t.persTemailInacap);
    }
    return [];
  }
}
