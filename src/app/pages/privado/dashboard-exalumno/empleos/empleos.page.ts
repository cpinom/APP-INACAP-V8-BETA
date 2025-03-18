import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { EventsService } from 'src/app/core/services/events.service';

@Component({
  selector: 'app-empleos',
  templateUrl: './empleos.page.html',
  styleUrls: ['./empleos.page.scss'],
})
export class EmpleosPage implements OnInit, OnDestroy {

  private nav = inject(NavController);
  private events = inject(EventsService);

  @ViewChild(IonContent) content!: IonContent;
  scrollObs: Subscription;

  constructor() {

    this.scrollObs = this.events.app.subscribe((event: any) => {
      if (event.action == 'scrollTop' && event.index == 1) {
        this.content?.scrollToTop(500);
      }
    });

  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.scrollObs.unsubscribe();
  }
  async detalleEmpleo(params: any) {
    await this.nav.navigateForward('/dashboard-exalumno/empleos/detalle-oferta', { state: params });
  }

}
