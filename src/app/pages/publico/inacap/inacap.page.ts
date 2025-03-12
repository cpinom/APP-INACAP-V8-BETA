import { Component, inject, OnInit } from '@angular/core';
import { VISTAS } from 'src/app/core/constants/publico';
import { PublicService } from 'src/app/core/services/http/public.service';
import { UtilsService } from 'src/app/core/services/utils.service';

enum Institucion {
  cft = 0,
  ip = 1,
  universidad = 2,
  ec = 4
};


@Component({
  selector: 'app-inacap',
  templateUrl: './inacap.page.html',
  styleUrls: ['./inacap.page.scss'],
  standalone: false
})
export class InacapPage implements OnInit {

  private utils = inject(UtilsService);
  private api = inject(PublicService);

  constructor() { }

  ngOnInit() {
  }
  async abrirInstituciones(inst: Institucion) {
    if (inst == Institucion.cft) {
      await this.utils.openLink('https://portales.inacap.cl/sobre-nosotros/cft/index');
      this.api.marcarVistaPublica(VISTAS.INSTITUCIONES, undefined, 'CFT');
    }
    else if (inst == Institucion.ip) {
      await this.utils.openLink('https://portales.inacap.cl/sobre-nosotros/ip/index');
      this.api.marcarVistaPublica(VISTAS.INSTITUCIONES, undefined, 'IP');
    }
    else if (inst == Institucion.universidad) {
      await this.utils.openLink('https://portales.inacap.cl/sobre-nosotros/universidad/index');
      this.api.marcarVistaPublica(VISTAS.INSTITUCIONES, undefined, 'UNIVERSIDAD');
    }
    else if (inst == Institucion.ec) {
      await this.utils.openLink('https://portales.inacap.cl/educacion-continua/index');
      this.api.marcarVistaPublica(VISTAS.INSTITUCIONES, undefined, 'EUDCACION-CONTINUA');
    }
  }
  async abrirMaterial() {
    await this.utils.openLink('https://portales.inacap.cl/estudiantes/recursos/reglamentos-y-politicas/index');
  }

}
