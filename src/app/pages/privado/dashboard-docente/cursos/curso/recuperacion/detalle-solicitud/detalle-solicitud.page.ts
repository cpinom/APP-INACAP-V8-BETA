import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/core/services/dialog.service';
import * as moment from 'moment';

@Component({
  selector: 'app-detalle-solicitud',
  templateUrl: './detalle-solicitud.page.html',
  styleUrls: ['./detalle-solicitud.page.scss'],
})
export class DetalleSolicitudPage implements OnInit {

  data: any;
  seccion: any;

  constructor(private dialog: DialogService) { }
  ngOnInit() { }
  formatFecha(fechaString: string) {
    const fecha = moment(fechaString, 'DD/MM/YYYY');
    return fecha.format('dddd D [de] MMMM, YYYY');
  }
  cerrar() {
    this.dialog.dismissModal()
  }

}
