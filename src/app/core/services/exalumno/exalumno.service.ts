import { Injectable } from '@angular/core';
import { PrivateService } from '../private.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ExalumnoService extends PrivateService {

  private storagePrefix: string = 'Exalumno-MOVIL';
  private apiPrefix = 'api';
  private baseUrl = '';

  constructor() {
    super();
    this.baseUrl = `${this.global.Api}/${this.apiPrefix}`;
  }

  getPrincipal() {
    return this.get(`${this.baseUrl}/v3/exalumno/principal`);
  }
  getPrincipalV4() {
    return this.get(`${this.baseUrl}/v4/exalumno/principal`);
  }
  getCorreos() {
    return this.get(`${this.baseUrl}/v4/inacapmail/summary`);
  }
  getConfiguraciones(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v3/exalumno/status`, params);
  }
  getPerfil() {
    return this.get(`${this.baseUrl}/v3/exalumno/perfil`);
  }
  validarFotoPerfilWeb(data: FormData, params?: any): Promise<any> {
    return Promise.resolve({});
    // return this.uploadWeb(`${this.baseUrl}/v3/exalumno/validar-foto-perfil`, data, params);
  }
  validarFotoPerfil(filepath: string, filename: string, params?: any): Promise<any> {
    return Promise.resolve({});
    // return this.upload(`${this.baseUrl}/v3/exalumno/validar-foto-perfil`, filepath, filename, params);
  }
  guardarFotoPerfil(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v3/exalumno/guardar-foto-perfil`, params);
  }
  getEmpleos(params: any) {
    return this.post(`${this.baseUrl}/v3/exalumno/empleos`, params);
  }
  getUltimosEmpleosV4() {
    return this.get(`${this.baseUrl}/v4/exalumno/ultimos-empleos`);
  }
  getEmpleosFiltrosV4() {
    return this.get(`${this.baseUrl}/v4/exalumno/empleos-filtros`);
  }
  getEmpleosFiltrosComunas(region: number) {
    return this.get(`${this.baseUrl}/v4/exalumno/empleos-comunas?region=${region}`);
  }
  getEmpleosV4(carrera: number, region: number, comuna: number, tipo: number, filtro: string, page: number) {
    return this.get(`${this.baseUrl}/v4/exalumno/empleos?carrera=${carrera}&region=${region}&comuna=${comuna}&tipo=${tipo}&filtro=${filtro}&page=${page}`);
  }
  getEmpleosAdicionales(params: any) {
    return this.post(`${this.baseUrl}/v3/exalumno/empleos-adicionales`, params)
  }
  getFiltrosEmpleos() {
    return this.get(`${this.baseUrl}/v3/exalumno/empleos-filtros`);
  }
  getEmpleosFiltrados(params: any) {
    return this.post(`${this.baseUrl}/v3/exalumno/empleos-filtrados`, params)
  }
  editarDatos(params: any) {
    return this.post(`${this.baseUrl}/v4/exalumno/editar-datos`, params)
  }
  activarRedExalumnos(params: any) {
    return this.post(`${this.baseUrl}/v3/exalumno/activar-red`, params)
  }
  getCompaneros(params: any) {
    return this.post(`${this.baseUrl}/v3/exalumno/companeros`, params)
  }
  getEventos() {
    return this.get(`${this.baseUrl}/v3/exalumno/eventos`);
  }
  getVitrina() {
    return this.get(`${this.baseUrl}/v4/exalumno/vitrina/principal`);
  }
  getVitrinaFiltrados() {
    return this.get(`${this.baseUrl}/v4/exalumno/vitrina/filtros`);
  }
  filtrarEmprendimientos(params: any) {
    return this.post(`${this.baseUrl}/v4/exalumno/vitrina/filtrar`, params)
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

}
