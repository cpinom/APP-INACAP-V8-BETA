import { inject, Injectable } from '@angular/core';
import { PrivateService } from './private.service';
import { AppGlobal } from 'src/app/app.global';

@Injectable({
  providedIn: 'root'
})
export class EstacionamientosService extends PrivateService {

  public override storagePrefix: string = 'Estacionamientos-MOVIL';

  constructor() {
    super();
    this.baseUrl = `${this.global.Api}/v2/estacionamientos`;
  }
  getPrincipalV6(sedeCcod: any, aepeNcorr: any) {
    return this.get(`${this.baseUrl}/principal?sedeCcod=${sedeCcod}&aepeNcorr=${aepeNcorr}`);
  }
  guardarPostulacion(params: any) {
    return this.post(`${this.baseUrl}/guardar-postulacion`, params);
  }
  getEstados(sedeCcod: any, aepeNcorr: any) {
    return this.get(`${this.baseUrl}/status?sedeCcod=${sedeCcod}&aepeNcorr=${aepeNcorr}`);
  }
}
