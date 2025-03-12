import { AfterViewInit, Component, inject } from '@angular/core';
import { VISTAS } from 'src/app/core/constants/publico';
import { PublicService } from 'src/app/core/services/http/public.service';

@Component({
  selector: 'app-detalle-destacado',
  templateUrl: './detalle-destacado.page.html',
  styleUrls: ['./detalle-destacado.page.scss'],
})
export class DetalleDestacadoPage implements AfterViewInit {

  private api = inject(PublicService);
  data: any;

  constructor() { }

  async ngAfterViewInit() {
    const principal = await this.api.getStorage('principal');
    const { destacado } = principal;

    destacado.apdeTdesc = destacado.apdeTdesc.replace(/\n/g, "<br />");
    destacado.apdeTdesc = destacado.apdeTdesc.replace(/<!--.*?-->/sg, "");

    this.data = destacado;
    this.api.marcarVistaPublica(VISTAS.DESTACADO);
  }

}
