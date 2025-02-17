import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService extends PrivateService {

  public override storagePrefix: string = 'Solicitudes-MOVIL';

  constructor() {
    super();
    this.baseUrl = `${this.global.Api}/api`;
  }
  getPrincipal(params: any) {
    return this.post(`${this.baseUrl}/v4/solicitudes/principal`, params);
  }
  getPrincipalV3(params: any) {
    return this.post(`${this.baseUrl}/v3/solicitudes/principal`, params);
  }
  getPrincipalV5(planCcod: any) {
    return this.get(`${this.baseUrl}/v5/solicitudes/principal?planCcod=${planCcod}`);
  }
  getSolicitudes(params: any) {
    return this.post(`${this.baseUrl}/v3/solicitudes/solicitudes`, params);
  }
  anularSolicitud(params: any) {
    return this.post(`${this.baseUrl}/v4/solicitudes/anular-solicitud`, params);
  }
  getDetalleSolicitud(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v3/solicitudes/detalle-solicitud`, params);
  }
  getDatosSolicitud(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v4/solicitudes/datos-solicitud`, params);
  }
  getHorasPracticas(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v3/solicitudes/horas-praticas`, params);
  }
  getAsignaturasPendientes(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v3/solicitudes/asignaturas-pendientes`, params);
  }
  getCiudades(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v3/solicitudes/ciudades`, params);
  }
  getComunas(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v3/solicitudes/comunas`, params);
  }
  getTiposDocumentos(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v3/solicitudes/tipos-documentos`, params);
  }
  agregarArchivoWeb(data: FormData, params: any): Promise<any> {
    return Promise.reject();
    // return this.uploadWeb(`${this.baseUrl}/v3/solicitudes/agregar-archivo`, data, params);
  }
  agregarArchivo(filepath: string, filename: string, params: any): Promise<any> {
    return Promise.reject();
    // return this.upload(`${this.baseUrl}/v3/solicitudes/agregar-archivo`, filepath, filename, params);
  }
  eliminarArchivo(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v3/solicitudes/eliminar-archivo`, params);
  }
  validarDocumentosObligatorios(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v4/solicitudes/validar-documentos-obligatorios`, params);
  }
  procesarSolicitud(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v3/solicitudes/procesar-solicitud`, params);
  }
  // crearSolicitudSoporte(params: any) {
  //   return this.post(`${this.baseUrl}/v3/solicitudes/crear-solicitud-soporte`, params);
  // }
  // cargarArchivoSolicitudSoporteWeb(data: FormData, params: any) {
  //   return this.uploadWeb(`${this.baseUrl}/v3/solicitudes/agregar-archivo-solicitud-soporte`, data, params);
  // }
  // cargarArchivoSolicitudSoporte(filepath: string, filename: string, params: any) {
  //   return this.upload(`${this.baseUrl}/v3/solicitudes/agregar-archivo-solicitud-soporte`, filepath, filename, params);
  // }
  // eliminarArchivoSolicitudSoporte(params: any) {
  //   return this.post(`${this.baseUrl}/v3/solicitudes/eliminar-archivo-solicitud-soporte`, params);
  // }
  // getSolicitudesSoporte() {
  //   return this.get(`${this.baseUrl}/v3/solicitudes/solicitudes-soporte`);
  // }
  // guardarSolicitudSoporte(params: any): Promise<any> {
  //   return this.post(`${this.baseUrl}/v3/solicitudes/solicitud-soporte`, params);
  // }
  // guardarSolicitudSoporteAntecedentes(params: any): Promise<any> {
  //   return this.post(`${this.baseUrl}/v3/solicitudes/solicitud-soporte-antecedentes`, params);
  // }
  // cancelarSolicitudSoporte(params: any): Promise<any> {
  //   return this.post(`${this.baseUrl}/v3/solicitudes/cancelar-solicitud-soporte`, params);
  // }
  override async clearStorage() {
    await Preferences.remove({ key: `${this.storagePrefix}-plan` });
    await Preferences.remove({ key: `${this.storagePrefix}-solicitud` });
  }

}
