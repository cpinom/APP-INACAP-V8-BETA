import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';

@Injectable({
  providedIn: 'root'
})
export class TutorIaService extends PrivateService {

  constructor() {
    super();
    this.baseUrl += '/tutor-ia';
  }

  iniciarAgenteSocratico(params: any) {
    return this.post(`${this.baseUrl}/v1/iniciar-agente-socratico`, params);
  }
  mensajeAgenteSocratico(params: any) {
    return this.post(`${this.baseUrl}/v1/mensaje-agente-socratico`, params);
  }
  iniciarAgentePractico(params: any) {
    return this.post(`${this.baseUrl}/v1/iniciar-agente-practico`, params);
  }
  mensajeAgentePractico(params: any) {
    return this.post(`${this.baseUrl}/v1/mensaje-agente-practico`, params);
  }
  getTemas(asigCcod: any) {
    return this.get(`${this.baseUrl}/v1/temas-curso?asigCcod=${asigCcod}`);
  }
  iniciarTest(params: any) {
    return this.post(`${this.baseUrl}/v1/iniciar-test`, params);
  }
  procesarTest(params: any) {
    return this.post(`${this.baseUrl}/v1/procesar-test`, params);
  }
}
