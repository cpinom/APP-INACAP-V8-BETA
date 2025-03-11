import { Component, inject, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import moment from 'moment';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SeguroAccidentesService } from 'src/app/core/services/http/seguroaccidentes.service';

@Component({
  selector: 'app-seguro-accidentes',
  templateUrl: './seguro-accidentes.page.html',
  styleUrls: ['./seguro-accidentes.page.scss'],
})
export class SeguroAccidentesPage implements OnInit {

  mostrarCargando = true;
  mostrarData = false;
  data: any;
  solicitudes!: any[];

  private api = inject(SeguroAccidentesService);
  private error = inject(ErrorHandlerService);
  private pt = inject(Platform);

  constructor() {
    moment.locale('es');
  }
  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    try {
      const result = await this.api.getPrincipal();

      if (result.success) {
        this.data = result.data;
        await this.api.setStorage('principal', this.data);
        await this.cargarSolicitudes();
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }

  }
  async cargarSolicitudes() {
    const result = await this.api.getSolicitudes();

    if (result.success) {
      this.solicitudes = this.procesarSolicitudes(result.data);

      if (this.pt.is('mobileweb') && this.solicitudes.length == 0) {
        this.solicitudes = [
          {
            solicitud: '2021-0001',
            fecha_recepcion: '2021-01-01',
            status: 'Aceptado',
            tipo: 'Solicitud de seguro'
          },
          {
            solicitud: '2021-0001',
            fecha_recepcion: '2021-01-01',
            status: 'Rechazado',
            tipo: 'Solicitud de seguro'
          },
          {
            solicitud: '2021-0001',
            fecha_recepcion: '2021-01-01',
            status: 'Transferido',
            tipo: 'Solicitud de seguro'
          }
        ];
      }
    }
    else {
      throw Error();
    }
  }
  procesarSolicitudes(data: any[]) {
    return data.sort((a, b) => {
      if (a.solicitud > b.solicitud)
        return -1;
      return 1;
    });
  }
  formatearFecha(data: string) {
    const fecha = moment(data, 'YYYY-MM-DD');
    return fecha.format('D [de] MMMM, YYYY');
  }
  resolverEstado(status: string) {
    if (status == 'Rechazado') {
      return 'danger';
    }
    if (status == 'Transferido') {
      return 'primary';
    }
    if (status == 'Aceptado' || status == 'Cheque emitido' || status == 'Reliquidación') {
      return 'success';
    }
    return 'warning';
  }


}
