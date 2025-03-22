import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';

@Injectable({
  providedIn: 'root'
})
export class PortafolioService extends PrivateService {

  constructor() {
    super();
    this.baseUrl += `/v5/portafolio`;
  }

  getPrincipal(matrNcorr: any, carrCcod: any, planCcod: any) {
    return this.get(`${this.baseUrl}/principal?matrNcorr=${matrNcorr}&carrCcod=${carrCcod}&planCcod=${planCcod}`);
  }
  getDelegaturas() {
    return this.get(`${this.baseUrl}/delegaturas`);
  }
  descargarPortafolio(params: any) {
    return this.post(`${this.baseUrl}/exportar`, params);
  }
}
