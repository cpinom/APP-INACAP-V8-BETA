import { Component, OnInit } from '@angular/core';
// import * as logoTrabajando from 'src/scripts/logo.trabajando.js';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/core/services/utils.service';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { NavController } from '@ionic/angular';
// import { Share } from '@capacitor/share';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  data: any;
  logo = '';//logoTrabajando.imgBase64;

  constructor(public router: Router,
    private utils: UtilsService,
    private nav: NavController) {
    moment.locale('es');
    this.data = this.router.getCurrentNavigation()?.extras.state;
  }
  async ngOnInit() {
    if (!this.data) {
      await this.nav.navigateBack(this.backUrl);
      return;
    }
  }
  abrirWebTrabajando(url: string) {
    this.utils.openLink(`${url}#apply`);
  }
  formatFecha(fechaString: string) {
    const fecha = moment(fechaString);
    return fecha.format('D [de] MMMM, YYYY');
  }
  // async compartir() {
  //   await Share.share({ url: this.data.url })
  // }
  get backUrl() {
    return this.router.url.startsWith('/alumno/servicios/ofertas-practica') ? '/alumno/servicios/ofertas-practica' : '/alumno/inicio/ofertas-practica';
  }

}
