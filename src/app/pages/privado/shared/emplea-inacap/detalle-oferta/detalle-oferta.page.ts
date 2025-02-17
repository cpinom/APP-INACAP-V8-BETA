import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { VISTAS_EXALUMNO } from 'src/app/core/constants/exalumno';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ExalumnoService } from 'src/app/core/services/http/exalumno.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-detalle-oferta',
  templateUrl: './detalle-oferta.page.html',
  styleUrls: ['./detalle-oferta.page.scss'],
})
export class DetalleOfertaPage implements OnInit {

  data: any;

  private router = inject(Router);
  private utils = inject(UtilsService);
  private exalumno = inject(ExalumnoService);
  private alumno = inject(AlumnoService);

  constructor() {

    moment.locale('es');

    if (this.router.getCurrentNavigation()?.extras.state) {
      this.data = this.router.getCurrentNavigation()?.extras.state;
    }
    else {
      if (this.esExalumno) {
        this.router.navigate(['exalumno/empleos'], { replaceUrl: true });
      }
      else {
        this.router.navigate(['alumno/servicios'], { replaceUrl: true });
      }
    }
  }
  ngOnInit() {
    if (this.esAlumno) {
      this.alumno.marcarVista(VISTAS_ALUMNO.DETALLE_EMPLEO);
    }
    else {
      this.exalumno.marcarVista(VISTAS_EXALUMNO.DETALLE_EMPLEO);
    }
  }
  abrirWebTrabajando(url: string) {
    this.utils.openLink(`${url}#apply`);
  }
  formatFecha(fechaString: string) {
    return moment(fechaString, 'YYYY-MM-DD').locale('es').format('D [de] MMMM, YYYY');
  }
  get esAlumno() { return this.router.url.startsWith('/dashboard-alumno/servicios') }
  get esExalumno() { return this.router.url.startsWith('/dashboard-exalumno/empleos') }

}
