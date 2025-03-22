import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { NavController } from '@ionic/angular';
import { EventsService } from 'src/app/core/services/events.service';
import { PublicService } from 'src/app/core/services/http/public.service';

@Component({
  selector: 'app-detalle-notificacion',
  templateUrl: './detalle-notificacion.page.html'
})
export class DetalleNotificacionPage implements OnInit {

  data: any;

  constructor(private router: Router,
    private nav: NavController,
    private api: PublicService,
    private events: EventsService) {
    this.data = this.router.getCurrentNavigation()?.extras.state;
  }
  async ngOnInit() {
    if (!this.data) {
      await this.nav.navigateBack(this.backUrl);
      return;
    }

    if (this.data.visto == 0) {
      const info = await Device.getId();
      const npreTuuid = info.identifier || 'web';
      const params = {
        apnoNcorr: this.data.apnoNcorr,
        npreTuuid: npreTuuid,
        apnmNtipo: 1
      };

      try {
        const result = await this.api.guardarNotificacionMovimiento(params);

        if (result.success) {
          this.events.app.next({ action: 'app:publico-notificaciones', value: result.notificaciones });
        }
      }
      catch { }
    }
  }
  get backUrl() {
    return this.router.url.replace('/detalle-notificacion', '')
  }

}
