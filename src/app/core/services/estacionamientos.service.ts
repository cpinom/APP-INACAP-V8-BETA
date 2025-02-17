import { inject, Injectable } from '@angular/core';
import { PrivateService } from './private.service';
import { AppGlobal } from 'src/app/app.global';

@Injectable({
  providedIn: 'root'
})
export class EstacionamientosService extends PrivateService {

  private appGlobal = inject(AppGlobal);
  private storagePrefix: string = 'Estacionamientos-MOVIL';
  private apiPrefix = 'api/v2/estacionamientos';
  private baseUrl: string = '';

  constructor() {
    super();
    this.baseUrl = `${this.appGlobal.Api}/${this.apiPrefix}`;
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
