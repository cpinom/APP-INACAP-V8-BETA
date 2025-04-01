import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppEvent } from 'src/app/core/interfaces/auth.interfaces';
import { DialogService } from 'src/app/core/services/dialog.service';
import { EventsService } from 'src/app/core/services/events.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { NotificacionesPage } from './notificaciones/notificaciones.page';

@Component({
  selector: 'app-dashboard-alumno',
  templateUrl: './dashboard-alumno.page.html',
  styleUrls: ['./dashboard-alumno.page.scss'],
})
export class DashboardAlumnoPage implements OnInit, OnDestroy {

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
      if (event.action == 'app:alumno-principal') {
        this.deshabilitarTabs = false;
      }
    });

    this.scrollObs = this.events.app.subscribe((event: AppEvent) => {
      if (event.action == 'app:alumno-notificaciones') {
        this.notificaciones();
      }
    });

  }
  ngOnInit() {
  }
  ngOnDestroy(): void {
    this.tabsObs.unsubscribe();
    this.scrollObs.unsubscribe();
  }
  checkTap(ev?: Event, index?: number) {
    this.events.app.next({ action: 'scrollTop', index: index, ev: ev });
  }
  async notificaciones() {
    await this.dialog.showModal({
      component: NotificacionesPage,
      canDismiss: true,
      presentingElement: this.routerOutlet.nativeEl
    });
  }
  longPressTap(ev: any) {
    debugger
  }

}
