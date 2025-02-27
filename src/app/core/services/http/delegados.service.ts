import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';

@Injectable({
  providedIn: 'root'
})
export class DelegadosService extends PrivateService {

  public override storagePrefix: string = 'Delegados-MOVIL';

  constructor() {
    super();
    this.baseUrl += `/v4`;
  }

  getPostulaciones() {
    return this.get(`${this.baseUrl}/delegados/postulaciones/principal`);
  }
  guardarPostulacion(params: any) {
    return this.post(`${this.baseUrl}/delegados/postulaciones/guardar`, params);
  }
  getVotaciones() {
    return this.get(`${this.baseUrl}/delegados/votaciones/principal`);
  }
  enviarVoto(params: any) {
    return this.post(`${this.baseUrl}/delegados/votaciones/votar`, params);
  }

}
