import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class OneDriveService extends PrivateService {

  public override storagePrefix: string = 'OveDrive-MOVIL';
  private apiPrefix = 'api/onedrive';

  constructor() {
    super();
    this.baseUrl = `${this.global.Api}/${this.apiPrefix}`;
  }
  getPrincipal() {
    return this.get(`${this.baseUrl}/v3/principal`);
  }
  getPrincipalV5(driveId: string) {
    return this.get(`${this.baseUrl}/v5/principal?driveId=${driveId}`);
  }
  crearCarpeta(params: any) {
    return this.post(`${this.baseUrl}/v3/crear-carpeta`, params);
  }
  renombrarCarpeta(params: any) {
    return this.post(`${this.baseUrl}/v3/renombrar-carpeta`, params);
  }
  getArchivos(params: any) {
    return this.post(`${this.baseUrl}/v3/archivos`, params);
  }
  getArchivosV5(driveId: string, driveItemId: string) {
    driveId = encodeURIComponent(driveId);
    driveItemId = encodeURIComponent(driveItemId);
    return this.get(`${this.baseUrl}/v5/archivos?driveId=${driveId}&driveItemId=${driveItemId}`);
  }
  cargarArchivo(folderId: string, params: any) {
    return this.post(`${this.baseUrl}/v5/cargar-archivo?folderId=${folderId}`, params);
  }
  eliminarArchivo(params: any) {
    return this.post(`${this.baseUrl}/v3/eliminar-archivo`, params);
  }
  descargarArchivo(params: any) {
    return this.post(`${this.baseUrl}/v3/descargar-archivo`, params);
  }
  override async clearStorage() {
    await Preferences.remove({ key: `${this.storagePrefix}-driveId` });
  }
}
