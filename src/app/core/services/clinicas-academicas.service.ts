import { inject, Injectable } from '@angular/core';
import { PrivateService } from './private.service';
import { AppGlobal } from 'src/app/app.global';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ClinicasAcademicasService extends PrivateService {

  private storagePrefix: string = 'Clinicas-MOVIL';
  private apiPrefix = 'api';
  private appGlobal = inject(AppGlobal);
  private baseUrl: string = '';

  constructor() {
    super();
    this.baseUrl = `${this.appGlobal.Api}/${this.apiPrefix}`;
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

  async setStorage(key: string, value: any) {
    await Preferences.set({
      key: `${this.storagePrefix}-${key}`,
      value: JSON.stringify(value)
    });
  }
  async getStorage(key: string) {
    return Preferences.get({ key: `${this.storagePrefix}-${key}` }).then(result => {
      return result.value ? JSON.parse(result.value) : null;
    });
  }
  async removeStorage(key: string) {
    await Preferences.remove({ key: `${this.storagePrefix}-${key}` });
  }
  async clearStorage() { }

}
