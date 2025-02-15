import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { EventsService } from 'src/app/core/services/events.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { PerfilPage } from './perfil/perfil.page';
import { Subscription } from 'rxjs';
import { AppEvent } from 'src/app/core/interfaces/auth.interfaces';
import { NotificacionesPage } from './notificaciones/notificaciones.page';

@Component({
  selector: 'app-dashboard-docente',
  templateUrl: './dashboard-docente.page.html',
  styleUrls: ['./dashboard-docente.page.scss'],
})
export class DashboardDocentePage implements OnInit, OnDestroy {

  private events = inject(EventsService);
  private dialog = inject(DialogService);
  private routerOutlet = inject(IonRouterOutlet);
  private profile = inject(ProfileService);
  deshabilitarTabs = false;
  scrollObs: Subscription;
  tabsObs: Subscription;

  constructor() {

    this.profile.getStorage('principal').then(principal => {
      this.deshabilitarTabs = principal == null;
    });

    this.tabsObs = this.events.app.subscribe((event: AppEvent) => {
      if (event.action == 'app:docente-principal') {
        this.deshabilitarTabs = false;
      }
    });

    this.scrollObs = this.events.app.subscribe((event: AppEvent) => {
      if (event.action == 'app:docente-notificaciones') {
        this.notificaciones();
      }
    });

  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.tabsObs.unsubscribe();
    this.scrollObs.unsubscribe();
  }
  checkTap(ev: Event, index?: number) {
    this.events.app.next({ action: 'scrollTop', index: index, ev: ev });
  }
  async perfil() {
    await this.dialog.showModal({
      component: PerfilPage,
      presentingElement: this.routerOutlet.nativeEl
    });
  }
  async notificaciones() {
    await this.dialog.showModal({
      component: NotificacionesPage,
      canDismiss: true,
      presentingElement: this.routerOutlet.nativeEl
    });
  }

}
