import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';

@Injectable({
  providedIn: 'root'
})
export class CuentaCorrienteService extends PrivateService {

  public override storagePrefix: string = 'CtaCte-MOVIL';

  constructor() {
    super();
    this.baseUrl = `${this.global.Api}/v3/cuenta-corriente`;
  }

  getPrincipal() {
    return this.get(`${this.baseUrl}/principal`);
  }
  getIntitucionesHistorial() {
    return this.get(`${this.baseUrl}/instituciones-historial`);
  }
  getCuentaCorriente(params: any) {
    return this.post(`${this.baseUrl}/cuenta-corriente`, params);
  }
  getDetalleConcepto(params: any) {
    return this.post(`${this.baseUrl}/detalle-concepto`, params);
  }
  descargarDocumento(params: any) {
    return this.post(`${this.baseUrl}/descargar-documento`, params);
  }
  getFiltrosBeneficios() {
    return this.get(`${this.baseUrl}/filtros-beneficios`);
  }
  getDetalleBeneficio(params: any) {
    return this.post(`${this.baseUrl}/detalle-beneficio`, params);
  }

}
