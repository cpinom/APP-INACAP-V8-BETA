import { Component, inject, OnInit } from '@angular/core';
import { ClinicasAcademicasService } from 'src/app/core/services/http/clinicas-academicas.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { DetalleAgendaPage } from './detalle-agenda/detalle-agenda.page';
import { EventsService } from 'src/app/core/services/events.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clinicas-academicas',
  templateUrl: './clinicas-academicas.page.html',
  styleUrls: ['./clinicas-academicas.page.scss'],
})
export class ClinicasAcademicasPage implements OnInit {

  mostrarCargando = true;
  mostrarData = false;
  permiteAgendar = true;
  tabModel = 0;
  data: any;
  reloadObs: Subscription;

  private api = inject(ClinicasAcademicasService);
  private profile = inject(ProfileService);
  private error = inject(ErrorHandlerService);
  private dialog = inject(DialogService);
  private events = inject(EventsService);

  constructor() {
    this.reloadObs = this.events.app.subscribe((event: any) => {
      if (event.action == 'app:clinicas-recargar') {
        this.recargar();
      }
    });
  }
  ngOnInit() {
    this.cargar();
  }
  ngOnDestroy() {
    this.reloadObs.unsubscribe();
  }
  async cargar() {
    try {
      const principal = await this.profile.getStorage('principal');
      const programa = principal.programas[principal.programaIndex];
      const request = await this.api.getAlumnoPrincipal(programa.sedeCcod, programa.matrNcorr);

      if (request.success) {
        this.data = request.data;
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
    }, 100);
  }
  async detalleAgenda(data: any) {
    const modal = await this.dialog.showModal({
      component: DetalleAgendaPage,
      componentProps: {
        data: data
      },
      presentingElement: getRouterOutlet() || undefined
    });

    modal.onDidDismiss().then(result => {
      if (result.data == true) {
        this.cargar();
      }
    })

  }

}

export function getRouterOutlet() {
  return document.getElementById('ion-router-outlet-content');
}
