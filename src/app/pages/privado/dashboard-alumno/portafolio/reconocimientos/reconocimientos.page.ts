import { Component, inject, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { PortafolioService } from 'src/app/core/services/http/portafolio.service';

@Component({
  selector: 'app-reconocimientos',
  templateUrl: './reconocimientos.page.html',
  styleUrls: ['./reconocimientos.page.scss'],
})
export class ReconocimientosPage implements OnInit {

  private api = inject(PortafolioService);
  private error = inject(ErrorHandlerService);

  mostrarCargando = true;
  mostrarData = false;
  delegaturas!: any[];

  constructor() { }

  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    try {
      const request = await this.api.getDelegaturas();

      if (request.success) {
        this.delegaturas = request.data.delegaturas;
      }
    }
    catch (error: any) {
      if (error && error.status === 401) {
        await this.error.handle(error);
        return
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    await this.cargar();
  }

}
