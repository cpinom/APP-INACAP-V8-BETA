import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';

@Injectable({
  providedIn: 'root'
})
export class CentroAyudaService extends PrivateService {

  public override storagePrefix: string = 'CentroAyuda-MOVIL';

  constructor() {
    super();
    this.baseUrl += `/centro-ayuda`;
  }
  getPrincipal() {
    return this.get(`${this.baseUrl}/v1/principal`);
  }
  getCaso(params: any) {
    return this.post(`${this.baseUrl}/v1/detalle-caso`, params);
  }
  crearCaso(params: any) {
    return this.post(`${this.baseUrl}/v1/crear-caso`, params);
  }
}
