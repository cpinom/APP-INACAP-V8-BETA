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
  // getPrincipal() {
  //   return this.get(`${this.baseUrl}/v3/buzon-opinion/principal`);
  // }
  getPrincipalV6() {
    return this.get(`${this.baseUrl}/v6/buzon-opinion/principal`);
  }
  // getSubcategorias(params: any) {
  //   return this.post(`${this.baseUrl}/v3/buzon-opinion/subcategorias`, params);
  // }
  getSubcategoriasV6(ticoCcod: any) {
    return this.get(`${this.baseUrl}/v6/buzon-opinion/subcategorias?ticoCcod=${ticoCcod}`);
  }
  // getOpiniones(params: any) {
  //   return this.post(`${this.baseUrl}/v3/buzon-opinion/opiniones`, params);
  // }
  getOpinionesV6(esreCcod: any, tuserCcod: any, start: any, limit: any, order: any, search: any) {
    return this.get(`${this.baseUrl}/v6/buzon-opinion/opiniones?esreCcod=${esreCcod}&tuserCcod=${tuserCcod}&start=${start}&limit=${limit}&order=${order}&search=${encodeURIComponent(search)}`);
  }
  // enviarOpinion(params: any) {
  //   return this.post(`${this.baseUrl}/v4/buzon-opinion/enviar-opinion`, params);
  // }
  enviarOpinionV6(params: any) {
    return this.post(`${this.baseUrl}/v6/buzon-opinion/enviar-opinion`, params);
  }
  // getDetalleOpinion(params: any) {
  //   return this.post(`${this.baseUrl}/v3/buzon-opinion/detalle-opinion`, params);
  // }
  getDetalleOpinionV6(resoNcorr: any, tuserCcod: any) {
    return this.get(`${this.baseUrl}/v6/buzon-opinion/detalle-opinion?resoNcorr=${resoNcorr}&tuserCcod=${tuserCcod}`);
  }
  cargarArchivoWeb(data: FormData, params: any): Promise<any> {
    return Promise.reject();
    // return this.uploadWeb(`${this.baseUrl}/v4/buzon-opinion/cargar-archivo`, data, params);
  }
  cargarArchivo(filepath: string, filename: string, params: any): Promise<any> {
    return Promise.reject();
    // return this.upload(`${this.baseUrl}/v4/buzon-opinion/cargar-archivo`, filepath, filename, params);
  }
  override async clearStorage() {
    await Preferences.remove({ key: `${this.storagePrefix}-principal` });
  }

}
