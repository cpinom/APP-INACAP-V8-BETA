import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';

@Injectable({
  providedIn: 'root'
})
export class BuscadorDocentesService extends PrivateService {

  private apiPrefix = 'api/buscador-docentes';

  constructor() {
    super();
    this.baseUrl = `${this.global.Api}/${this.apiPrefix}`;
  }
  getPrincipal(sedeCcod: any): Promise<any> {
    return this.get(`${this.baseUrl}/v5/principal?sedeCcod=${sedeCcod}`);
  }
  getBuscadorCarrerasV5(sedeCcod: any, areaCcod: any): Promise<any> {
    return this.get(`${this.baseUrl}/v5/carreras?sedeCcod=${sedeCcod}&areaCcod=${areaCcod}`);
  }
  getBuscadorAsignaturasV5(sedeCcod: any, carrCcod: any): Promise<any> {
    return this.get(`${this.baseUrl}/v5/asignaturas?sedeCcod=${sedeCcod}&carrCcod=${encodeURIComponent(carrCcod)}`);
  }
  getDocentesPorAsignaruraV5(sedeCcod: any, areaCcod: any, carrCcod: any, asigCcod: any): Promise<any> {
    return this.get(`${this.baseUrl}/v5/docentes-asignatura?sedeCcod=${sedeCcod}&areaCcod=${areaCcod}&carrCcod=${encodeURIComponent(carrCcod)}&asigCcod=${asigCcod}`);
  }
  getDocentesPorNombreV5(sedeCcod: any, docente: any): Promise<any> {
    return this.get(`${this.baseUrl}/v5/docentes?sedeCcod=${sedeCcod}&docente=${encodeURIComponent(docente)}`);
  }
  getPlanificacionSalaV5(sedeCcod: any, salaCcod: any, fechaInicio: any, fechaTermino: any): Promise<any> {
    return this.get(`${this.baseUrl}/v5/planificacion-sala?sedeCcod=${sedeCcod}&salaCcod=${salaCcod}&fechaInicio=${encodeURIComponent(fechaInicio)}&fechaTermino=${encodeURIComponent(fechaTermino)}`);
  }
  getPlanificacionDocenteV5(sedeCcod: any, persNcorr: any, fechaInicio: any, fechaTermino: any): Promise<any> {
    return this.get(`${this.baseUrl}/v5/planificacion-docente?sedeCcod=${sedeCcod}&persNcorr=${persNcorr}&fechaInicio=${encodeURIComponent(fechaInicio)}&fechaTermino=${encodeURIComponent(fechaTermino)}`);
  }

}
