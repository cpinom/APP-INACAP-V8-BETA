import { Component, inject, OnInit } from '@angular/core';
import { AppGlobal } from 'src/app/app.global';
import { EventsService } from 'src/app/core/services/events.service';

@Component({
  selector: 'app-portafolio',
  templateUrl: './portafolio.page.html',
  styleUrls: ['./portafolio.page.scss'],
})
export class PortafolioPage implements OnInit {

  private events = inject(EventsService);
  private global = inject(AppGlobal);

  constructor() { }

  ngOnInit() {
  }

  notificacionesTap() {
    this.events.app.next({ action: 'app:alumno-notificaciones' });
  }
  get mostrarNotificaciones() {
    return this.global.NotificationFlag;
  }

}
