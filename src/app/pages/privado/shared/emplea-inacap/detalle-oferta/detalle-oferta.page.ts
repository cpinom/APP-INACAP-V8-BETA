import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Share } from '@capacitor/share';
import * as moment from 'moment';
import { VISTAS_ALUMNO, VISTAS_EXALUMNO } from 'src/app/app.constants';
import { AlumnoService } from 'src/app/core/services/alumno/alumno.service';
import { ExalumnoService } from 'src/app/core/services/exalumno/exalumno.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-detalle-oferta',
  templateUrl: './detalle-oferta.page.html',
  styleUrls: ['./detalle-oferta.page.scss'],
})
export class DetalleOfertaPage implements OnInit {

  data: any;

  constructor(public router: Router,
    private utils: UtilsService,
    private exalumno: ExalumnoService,
    private alumno: AlumnoService) {

    moment.locale('es');

    if (router.getCurrentNavigation().extras.state) {
      this.data = this.router.getCurrentNavigation().extras.state;
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
  abrirWebTrabajando(url) {
    this.utils.openLink(`${url}#apply`);
  }
  // async compartir() {
  //   await Share.share({ url: this.data.url })
  // }
  formatFecha(fechaString) {
    return moment(fechaString, 'YYYY-MM-DD').locale('es').format('D [de] MMMM, YYYY');
  }
  get esAlumno() { return this.router.url.startsWith('/alumno/servicios') }
  get esExalumno() { return this.router.url.startsWith('/exalumno/empleos') }

}
