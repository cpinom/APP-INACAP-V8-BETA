import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';

@Injectable({
  providedIn: 'root'
})
export class ReservasEspacioService extends PrivateService {

  public override storagePrefix: string = 'Reservas-MOVIL';
  private apiPrefix = 'api/reservas-espacio';

  constructor() {
    super();
    this.baseUrl = `${this.global.Api}/${this.apiPrefix}`;
  }
  getPrincipal(params: any) {
    return this.post(`${this.baseUrl}/v1/principal`, params);
  }
  getProveedores(params: any) {
    return this.post(`${this.baseUrl}/v1/proveedores`, params);
  }
  getProveedoresV2(arcaCcodServicio: any) {
    return this.get(`${this.baseUrl}/v2/proveedores?arcaCcodServicio=${encodeURIComponent(arcaCcodServicio)}`);
  }
  getCamposAdicionalesV2(arcaCcodServicio: any) {
    return this.get(`${this.baseUrl}/v2/campos-adicionales?arcaCcodServicio=${arcaCcodServicio}`);
  }
  getDisponibilidad(params: any) {
    return this.post(`${this.baseUrl}/v1/disponibilidad`, params);
  }
  crearReserva(params: any) {
    return this.post(`${this.baseUrl}/v1/crear-reserva`, params);
  }
  crearReservaV2(params: any) {
    return this.post(`${this.baseUrl}/v2/crear-reserva`, params);
  }
  getDetalleReserva(params: any) {
    return this.post(`${this.baseUrl}/v1/detalle-reserva`, params);
  }
  cancelarReserva(params: any) {
    return this.post(`${this.baseUrl}/v1/cancelar-reserva`, params);
  }
}
