import { Component, inject, OnInit } from '@angular/core';
import { ClinicasAcademicasService } from 'src/app/core/services/clinicas-academicas.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';

@Component({
  selector: 'app-marcar-asistencia',
  templateUrl: './marcar-asistencia.page.html',
  styleUrls: ['./marcar-asistencia.page.scss'],
})
export class MarcarAsistenciaPage implements OnInit {

  data: any;
  participantes!: any[];
  mostrarParticipantes = false;

  private dialog = inject(DialogService);
  private api = inject(ClinicasAcademicasService);
  private error = inject(ErrorHandlerService);

  constructor() { }

  ngOnInit() {
    try {
      this.participantes = JSON.parse(this.data.participantes);
      console.log(this.data);
      console.log(this.participantes);
    }
    catch {
      this.participantes = [];
    }
  }
  async procesarMarcaje(params: any) {
    const loading = await this.dialog.showLoading({ message: 'Procesando...' });

    try {
      const request = await this.api.marcarAsistencia(params);

      if (request.success) {
        this.dialog.dismissModal(true);
      }
      else {
        this.mostrarAlerta('Ha ocurrido un error procesando su solicitud. Vuelva a intentar.')
      }
    }
    catch (error: any) {
      this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  async marcarInasistencia() {
    const confirm = await this.confirmarMarcaje('Quedará registrado que el estudiante no asistió a su hora de clínica académica.');

    if (confirm == true) {
      const participantes = this.resolverAsistencia();
      const params = { acofNcorr: this.data.acofNcorr, acesCcod: 5, participantes: participantes };
      await this.procesarMarcaje(params);
    }
  }
  async marcarAsistencia() {
    const participantes = this.resolverAsistencia();
    const asisten = participantes.filter(t => t.acpaNasiste == 1);

    if (asisten.length == 0) {
      await this.mostrarAlerta('Debe marcar asistencia para continuar.');
      return;
    }

    const confirm = await this.confirmarMarcaje('¿Esta seguro de continuar con el marcaje de Asistencia?');

    if (confirm == true) {
      const params = { acofNcorr: this.data.acofNcorr, acesCcod: 4, participantes: participantes };
      await this.procesarMarcaje(params);
    }
  }
  async confirmarMarcaje(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.dialog.showAlert({
        header: 'Marcar Asistencia',
        message: message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              resolve(false);
            }
          },
          {
            text: 'Continuar',
            role: 'destructive',
            handler: () => {
              resolve(true);
            }
          }
        ]
      }).then(alert => alert.present());
    });
  }
  async mostrarAlerta(message: string, callback?: Function) {
    const alert = await this.dialog.showAlert({
      cssClass: 'alert-message',
      message: `<img src="./assets/images/warning.svg" /><br />${message}`,
      header: 'Marcar Asistencia',
      buttons: [
        {
          text: 'Aceptar',
          role: 'cancel',
          handler: () => {
            callback && callback();
          }
        }
      ]
    });

    return alert;
  }
  resolverAsistencia() {
    if (!this.participantes) {
      return [];
    }
    const asistencia = this.participantes.map(t => {
      return {
        acpaNcorr: t.acpaNcorr,
        persTemailInacap: t.persTemailInacap,
        acpaNasiste: t.checked === true ? 1 : 0
      }
    });

    return asistencia;
  }
  cerrar() {
    this.dialog.dismissModal();
  }

}
