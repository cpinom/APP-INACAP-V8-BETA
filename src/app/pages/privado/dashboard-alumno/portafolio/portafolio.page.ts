import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppGlobal } from 'src/app/app.global';
import { EventsService } from 'src/app/core/services/events.service';

@Component({
  selector: 'app-portafolio',
  templateUrl: './portafolio.page.html',
  styleUrls: ['./portafolio.page.scss'],
})
export class PortafolioPage implements OnInit, OnDestroy {

   @ViewChild(IonContent) content!: IonContent;
  activeTab = 0;
scrollObs: Subscription;

  private events = inject(EventsService);
  private global = inject(AppGlobal);

  constructor() {

    this.scrollObs = this.events.app.subscribe((event: any) => {
      if (event.action == 'scrollTop' && event.index == 2) {
        this.content?.scrollToTop(500);
      }
    });

  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.scrollObs.unsubscribe();
  }
  notificacionesTap() {
    this.events.app.next({ action: 'app:alumno-notificaciones' });
  }
  get mostrarNotificaciones() {
    return this.global.NotificationFlag;
  }

}
