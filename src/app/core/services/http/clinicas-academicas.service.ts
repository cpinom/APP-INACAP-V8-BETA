import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';

@Injectable({
  providedIn: 'root'
})
export class ClinicasAcademicasService extends PrivateService {

  public override storagePrefix: string = 'Clinicas-MOVIL';

  constructor() {
    super();
    this.baseUrl = `${this.global.Api}/api`;
  }

  getDocentePrincipal(sedeCcod: any) {
    return this.get(`${this.baseUrl}/docente/clinicas-academicas/v1/principal?sedeCcod=${sedeCcod}`);
  }
  marcarAsistencia(params: any) {
    return this.post(`${this.baseUrl}/docente/clinicas-academicas/v1/marcar-asistencia`, params);
  }
  getAlumnoPrincipal(sedeCcod: any, matrNcorr: any) {
    return this.get(`${this.baseUrl}/clinicas-academicas/v1/principal?sedeCcod=${sedeCcod}&matrNcorr=${matrNcorr}`);
  }
  getOfertasDisponibles(sedeCcod: any) {
    return this.get(`${this.baseUrl}/clinicas-academicas/v1/ofertas-disponibles?sedeCcod=${sedeCcod}`);
  }
  buscarAlumno(sedeCcod: any, rut: any) {
    return this.get(`${this.baseUrl}/clinicas-academicas/v1/buscar-persona?sedeCcod=${sedeCcod}&rut=${encodeURIComponent(rut)}`);
  }
  agendarOferta(params: any) {
    return this.post(`${this.baseUrl}/clinicas-academicas/v1/agendar-oferta`, params);
  }
  cancelarAgenda(params: any) {
    return this.delete(`${this.baseUrl}/clinicas-academicas/v1/cancelar-agenda`, params);
  }

}
