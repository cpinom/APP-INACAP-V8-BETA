import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';

@Injectable({
  providedIn: 'root'
})
export class PortalPagosService extends PrivateService {

  public override storagePrefix: string = 'PortalPagos-MOVIL';

  constructor() {
    super();
    this.baseUrl = `${this.global.Api}/v3/portalpagos`;
  }

  getPrincipal() {
    return this.get(`${this.baseUrl}/principal`);
  }
  getCompromisos(params: any) {
    return this.post(`${this.baseUrl}/compromisos`, params);
  }
  getDetalleCompromiso(params: any) {
    return this.post(`${this.baseUrl}/detalle-compromiso`, params);
  }
  agregarCarro(params: any) {
    return this.post(`${this.baseUrl}/agregar-carro`, params);
  }
  eliminarCarro(params: any) {
    return this.post(`${this.baseUrl}/eliminar-carro`, params);
  }
  solicitarPago(params: any) {
    return this.post(`${this.baseUrl}/solicitar-pago-url`, params);
  }
  getPagoExito(params: any) {
    return this.post(`${this.baseUrl}/pago-exito`, params);
  }
  getPagoFracaso(params: any) {
    return this.post(`${this.baseUrl}/pago-fracaso`, params);
  }
  enviarCorreoComprobante(params: any) {
    return this.post(`${this.baseUrl}/correo-comprobante-pago`, params);
  }
  descargarCertificado(params: any) {
    return this.post(`${this.baseUrl}/descargar-certificado`, params);
  }
}
