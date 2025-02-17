import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';
import { AuthService } from './auth.service';
import { Global } from 'src/app/app.global';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class BuscadorDocentesService extends PrivateService {

  private apiPrefix = 'api/buscador-docentes';

  constructor(auth: AuthService, global: Global, http: HTTP) {
    super(auth, global, http);
    this.baseUrl = `${global.Api}/${this.apiPrefix}`;
  }
  getPrincipal(sedeCcod: any): Promise<any> {
    return this.get(`${this.baseUrl}/v5/principal?sedeCcod=${sedeCcod}`);
  }
  // getBuscadorAreas(params: any): Promise<any> {
  //   return this.post(`${this.baseUrl}/v4/areas`, params);
  // }
  // getBuscadorCarreras(params: any): Promise<any> {
  //   return this.post(`${this.baseUrl}/v4/carreras`, params);
  // }
  getBuscadorCarrerasV5(sedeCcod: any, areaCcod: any): Promise<any> {
    return this.get(`${this.baseUrl}/v5/carreras?sedeCcod=${sedeCcod}&areaCcod=${areaCcod}`);
  }
  // getBuscadorAsignaturas(params: any): Promise<any> {
  //   return this.post(`${this.baseUrl}/v4/asignaturas`, params);
  // }
  getBuscadorAsignaturasV5(sedeCcod: any, carrCcod: any): Promise<any> {
    return this.get(`${this.baseUrl}/v5/asignaturas?sedeCcod=${sedeCcod}&carrCcod=${encodeURIComponent(carrCcod)}`);
  }
  // getDocentesPorAsignarura(params: any): Promise<any> {
  //   return this.post(`${this.baseUrl}/v4/docentes-asignatura`, params);
  // }
  getDocentesPorAsignaruraV5(sedeCcod: any, areaCcod: any, carrCcod: any, asigCcod: any): Promise<any> {
    return this.get(`${this.baseUrl}/v5/docentes-asignatura?sedeCcod=${sedeCcod}&areaCcod=${areaCcod}&carrCcod=${encodeURIComponent(carrCcod)}&asigCcod=${asigCcod}`);
  }
  // getDocentesPorNombre(params: any): Promise<any> {
  //   return this.post(`${this.baseUrl}/v4/docentes`, params);
  // }
  getDocentesPorNombreV5(sedeCcod: any, docente: any): Promise<any> {
    return this.get(`${this.baseUrl}/v5/docentes?sedeCcod=${sedeCcod}&docente=${encodeURIComponent(docente)}`);
  }
  // getPlanificacionSala(params: any): Promise<any> {
  //   return this.post(`${this.baseUrl}/v4.1/planificacion-sala`, params);
  // }
  getPlanificacionSalaV5(sedeCcod: any, salaCcod: any, fechaInicio: any, fechaTermino: any): Promise<any> {
    return this.get(`${this.baseUrl}/v5/planificacion-sala?sedeCcod=${sedeCcod}&salaCcod=${salaCcod}&fechaInicio=${encodeURIComponent(fechaInicio)}&fechaTermino=${encodeURIComponent(fechaTermino)}`);
  }
  // getPlanificacionDocente(params: any): Promise<any> {
  //   return this.post(`${this.baseUrl}/v4.1/planificacion-docente`, params);
  // }
  getPlanificacionDocenteV5(sedeCcod: any, persNcorr: any, fechaInicio: any, fechaTermino: any): Promise<any> {
    return this.get(`${this.baseUrl}/v5/planificacion-docente?sedeCcod=${sedeCcod}&persNcorr=${persNcorr}&fechaInicio=${encodeURIComponent(fechaInicio)}&fechaTermino=${encodeURIComponent(fechaTermino)}`);
  }

}
