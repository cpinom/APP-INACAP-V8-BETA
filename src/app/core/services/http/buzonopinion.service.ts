import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class BuzonOpinionService extends PrivateService {

  public override storagePrefix: string = 'BuzonOpinion-MOVIL';

  constructor() {
    super();
    this.baseUrl = `${this.global.Api}/api`;
  }
  getPrincipalV6() {
    return this.get(`${this.baseUrl}/v6/buzon-opinion/principal`);
  }
  getSubcategoriasV6(ticoCcod: any) {
    return this.get(`${this.baseUrl}/v6/buzon-opinion/subcategorias?ticoCcod=${ticoCcod}`);
  }
  getOpinionesV6(esreCcod: any, tuserCcod: any, start: any, limit: any, order: any, search: any) {
    return this.get(`${this.baseUrl}/v6/buzon-opinion/opiniones?esreCcod=${esreCcod}&tuserCcod=${tuserCcod}&start=${start}&limit=${limit}&order=${order}&search=${encodeURIComponent(search)}`);
  }
  enviarOpinionV6(params: any) {
    return this.post(`${this.baseUrl}/v6/buzon-opinion/enviar-opinion`, params);
  }
  getDetalleOpinionV6(resoNcorr: any, tuserCcod: any) {
    return this.get(`${this.baseUrl}/v6/buzon-opinion/detalle-opinion?resoNcorr=${resoNcorr}&tuserCcod=${tuserCcod}`);
  }
  cargarArchivoV6(tuserCcod: any, params: any) {
    return this.post(`${this.baseUrl}/v6/buzon-opinion/cargar-archivo?tuserCcod=${tuserCcod}`, params);
  }
  descargarAdjuntoV6(resoNcorr: any, tuserCcod: any) {
    return this.get(`${this.baseUrl}/v6/buzon-opinion/descargar-archivo?resoNcorr=${resoNcorr}&tuserCcod=${tuserCcod}`);
  }
  eliminarArchivoV6(resoNcorr: any, tuserCcod: any) {
    return this.delete(`${this.baseUrl}/v6/buzon-opinion/eliminar-archivo?resoNcorr=${resoNcorr}&tuserCcod=${tuserCcod}`);
  }
  override async clearStorage() {
    await Preferences.remove({ key: `${this.storagePrefix}-principal` });
  }

}
