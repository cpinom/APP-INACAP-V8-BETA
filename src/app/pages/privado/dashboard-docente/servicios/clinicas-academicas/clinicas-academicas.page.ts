import { Component, inject, OnInit } from '@angular/core';
import { ClinicasAcademicasService } from 'src/app/core/services/http/clinicas-academicas.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { MarcarAsistenciaPage } from './marcar-asistencia/marcar-asistencia.page';
import { DetalleAgendaPage } from './detalle-agenda/detalle-agenda.page';

enum Vistas {
  RESERVADAS = 0,
  DISPONIBLES = 1,
  HISTORIAL = 2
}

@Component({
  selector: 'app-clinicas-academicas',
  templateUrl: './clinicas-academicas.page.html',
  styleUrls: ['./clinicas-academicas.page.scss'],
})
export class ClinicasAcademicasPage implements OnInit {

  mostrarCargando = true;
  mostrarData = false;
  tabModel = Vistas.RESERVADAS;
  data: any;
  private api = inject(ClinicasAcademicasService);
  private profile = inject(ProfileService);
  private error = inject(ErrorHandlerService);
  private dialog = inject(DialogService);

  constructor() { }

  ngOnInit() {
    this.cargar();
  }
  async cargar() {
    try {
      const principal = await this.profile.getStorage('principal');
      const result = await this.api.getDocentePrincipal(principal.sedeCcod);

      if (result.success) {
        this.data = result.data;
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
  recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  habilitarAsistencia(item: any): boolean {
    return true;//moment(item.acofFmodulo, 'DD/MM/YYYY').isSame(moment(), 'day');
  }
  async detalleAgenda(item: any) {
    const modal = await this.dialog.showModal({
      component: DetalleAgendaPage,
      componentProps: { data: item },
      presentingElement: getRouterOutlet() || undefined
    });
  }
  async marcarAsistencia(event: any, item: any) {
    event.stopPropagation();

    const modal = await this.dialog.showModal({
      component: MarcarAsistenciaPage,
      componentProps: { data: item },
      presentingElement: getRouterOutlet() || undefined
    });

    modal.onDidDismiss().then(result => {
      if (result.data == true) {
        this.mostrarExito('El marcaje de asistencia se proceso correctamente.');
        this.recargar();
      }
    })
  }
  async mostrarExito(message: string) {
    await this.dialog.showAlert({
      keyboardClose: false,
      backdropDismiss: false,
      header: 'Nueva Reserva.',
      cssClass: 'success-alert',
      message: `<div class="image"><img src = "./assets/images/icon_check_circle.svg" width="35px" height="35px"></div>${message}`,
      buttons: ['Aceptar']
    });
  }

}

export function getRouterOutlet() {
  return document.getElementById('ion-router-outlet-content');
}
