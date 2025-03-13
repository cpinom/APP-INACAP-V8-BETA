import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService extends PrivateService {

  constructor() {
    super();
    this.baseUrl += `/v3/documentos`;
  }

  getPrincipal() {
    return this.get(`${this.baseUrl}/principal`);
  }
  descargarContrato(params: any) {
    return this.post(`${this.baseUrl}/descargar-contrato`, params);
  }
  descargarAcuerdoTurorial(params: any) {
    return this.post(`${this.baseUrl}/descargar-acuerdo-tutorial`, params);
  }
}
