import { Component, inject, OnInit } from '@angular/core';
import { VISTAS } from 'src/app/core/constants/publico';
import { PublicService } from 'src/app/core/services/http/public.service';

@Component({
  selector: 'app-detalle-inacap',
  templateUrl: './detalle-inacap.page.html',
  styleUrls: ['./detalle-inacap.page.scss'],
})
export class DetalleInacapPage implements OnInit {

  private api = inject(PublicService);

  mostrarCargando = true;
  mostrarData = false;
  mostrarError = false;
  data: any;

  constructor() { }
  async ngOnInit() {
    await this.cargar();
    this.api.marcarVistaPublica(VISTAS.DETALLE_INACAP);
  }
  async cargar() {
    try {
      const result = await this.api.getDetalleInacap();

      if (result.success) {
        this.data = result.data?.replace(/\n/g, "<br />");
        this.mostrarData = true;
        await this.api.setStorage('inacap', this.data);
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      const result = await this.api.getStorage('inacap');

      if (result) {
        this.data = result;
        this.mostrarData = true;
      }
      else {
        this.mostrarError = true;
      }
    }
    finally {
      this.mostrarCargando = false;
    }
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    this.mostrarError = false;
    setTimeout(() => {
      this.cargar();
    }, 500);
  }

}
