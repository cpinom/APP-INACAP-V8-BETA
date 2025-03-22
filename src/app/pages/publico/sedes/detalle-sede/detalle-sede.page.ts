import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicService } from 'src/app/core/services/http/public.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-detalle-sede',
  templateUrl: './detalle-sede.page.html',
  styleUrls: ['./detalle-sede.page.scss'],
})
export class DetalleSedePage implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private api = inject(PublicService);
  private utils = inject(UtilsService);

  data: any;

  constructor() { }

  async ngOnInit() {
    this.data = await this.getSede();
  }
  async getSede() {
    try {
      let zonas = await this.api.getStorage('zonas');
      let data: any;

      if (!zonas) {
        let result = await this.api.getZonas();
        if (result.success) {
          zonas = result.zonas;
          await this.api.setStorage('zonas', zonas);
        }
      }

      if (zonas) {
        zonas.forEach((zona: any) => {
          if (!data) {
            data = zona.sedes.find((t: any) => t.sedeCcod == this.sedeCcod);
            data && (data.sedeBarchivo = `${this.api.baseUrl}/v3/imagen-sede/${this.sedeCcod}`);
          }
        });

        if (data) {
          return Promise.resolve(data);
        }
      }
    }
    catch { }

    return Promise.reject();
  }
  async mostrarRuta() {
    this.utils.openLink(`https://maps.google.com/maps?daddr=${this.data.sedeTlatitud},${this.data.sedeTlongitud}&amp;ll=`);
  }

  get sedeCcod() {
    return this.route.snapshot.paramMap.get('sedeCcod');
  }
  get backUrl() {
    return this.router.url.replace(`/detalle-sede/${this.sedeCcod}`, '');
  }
  get backText() {
    const espeCcod = this.route.snapshot.paramMap.get('espeCcod');

    if (espeCcod != null) {
      return '';
    }

    return 'Sedes';
  }

}
