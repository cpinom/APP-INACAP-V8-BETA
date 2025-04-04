import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';
import { Preferences } from '@capacitor/preferences';
@Injectable({
  providedIn: 'root'
})
export class SeguroAccidentesService extends PrivateService {

  public override storagePrefix: string = 'Seguro-MOVIL';

  constructor() {
    super();
  }
  getPrincipal() {
    return this.get(`${this.baseUrl}/v5/seguro-accidentes/principal`);
  }
  getSolicitudes() {
    return this.get(`${this.baseUrl}/v5/seguro-accidentes/reembolsos`);
  }
  cargarArchivo(aptiNcorr: any, params: any) {
    return this.post(`${this.baseUrl}/v5/seguro-accidentes/cargar-archivo?aptiNcorr=${aptiNcorr}`, params);
  }
  eliminarArchivo(aptiNcorr: any, aptaNcorr: any) {
    return this.delete(`${this.baseUrl}/v5/seguro-accidentes/eliminar-archivo?aptiNcorr=${aptiNcorr}&aptaNcorr=${aptaNcorr}`);
  }
  eliminarSolicitud(aptiNcorr: any) {
    return this.delete(`${this.baseUrl}/v5/seguro-accidentes/eliminar-solicitud?aptiNcorr=${aptiNcorr}`);
  }
  descargarArchivo(aptaNcorr: any) {
    return this.get(`${this.baseUrl}/v5/seguro-accidentes/descargar-archivo?aptaNcorr=${aptaNcorr}`);
  }
  enviarSolicitud(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v6/seguro-accidentes/enviar-solicitud`, params);
  }
  override async clearStorage() {
    await Preferences.remove({ key: `${this.storagePrefix}-principal` });
  }

}