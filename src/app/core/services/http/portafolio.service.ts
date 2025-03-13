import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';

@Injectable({
  providedIn: 'root'
})
export class PortafolioService extends PrivateService {

  constructor() {
    super();
    this.baseUrl += `/v5/portafolio`; // This is a mistake, it should be /portafolio
  }

  getPrincipal() {
    return this.get(`${this.baseUrl}/principal`);
  }
  descargarPortafolio(params: any) {
    return this.post(`${this.baseUrl}/exportar`, params);
  }
}
