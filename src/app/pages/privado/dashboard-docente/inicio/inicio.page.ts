import { Component, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppGlobal } from 'src/app/app.global';
import { AuthService } from 'src/app/core/services/auth.service';
import { EventsService } from 'src/app/core/services/events.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  private events = inject(EventsService);
  private global = inject(AppGlobal);
  private authService = inject(AuthService);
  private nav = inject(NavController);

  constructor() { }

  ngOnInit() {
  }

  notificacionesTap() {
    this.events.app.next({ action: 'app:docente-notificaciones' });
  }

  async logout() {
    await this.authService.clearAuth(true);
    await this.nav.navigateRoot('publico');
  }

  get mostrarNotificaciones() {
    return this.global.NotificationFlag;
  }

}
