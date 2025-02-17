import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppGlobal } from 'src/app/app.global';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';
import { DocenteService } from 'src/app/core/services/docente/docente.service';
import { EventsService } from 'src/app/core/services/events.service';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.page.html',
  styleUrls: ['./horario.page.scss'],
})
export class HorarioPage implements OnInit {

  @ViewChild(IonContent) content!: IonContent;
  mostrarCargando = true;
  mostrarData = true;
  mostrarError = false;
  mostrarTitulo = true;
  subscription: Subscription;

  private api = inject(DocenteService);
  private events = inject(EventsService);
  private global = inject(AppGlobal);

  constructor() {

    this.subscription = this.events.app.subscribe((event: any) => {
      if (event.action == 'scrollTop' && event.index == 2) {
        this.content?.scrollToTop(500);
      }
    });
  }

  ngOnInit() {
    this.api.marcarVista(VISTAS_DOCENTE.HORARIO);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  recargar() {
    this.mostrarData = true;
  }
  notificacionesTap() {
    this.events.app.next({ action: 'app:docente-notificaciones' })
  }
  async onEventoTap(data: any) { }
  async onAfterLoad(e: any) {
    this.mostrarCargando = true;
  }
  async onCompleteLoad(e: any) {
    this.mostrarCargando = false;
  }
  onChangeOrientation(orientation: any) {
    this.mostrarTitulo = orientation == 'landscape';
  }
  async onError(e: any) {
    this.mostrarCargando = false;
    this.mostrarData = false;
    this.mostrarError = true;
  }
  get mostrarNotificaciones() {
    return this.global.NotificationFlag;
  }

}
