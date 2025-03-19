import { inject, Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { AppGlobal } from 'src/app/app.global';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  baseUrl: string = '';
  storagePrefix: string = 'Public-MOVIL';

  private global = inject(AppGlobal);

  constructor() {
    this.baseUrl = `${this.global.Api}/api`;
  }
  private get = async (url: string) => {
    const options: HttpOptions = {
      url: url,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await CapacitorHttp.get(options);

      if (response.status == 200) {
        return response.data;
      }
      else {
        return Promise.reject(response);
      }
    }
    catch (error: any) {
      return Promise.reject(error);
    }
  }
  public post = async (url: string, params: any) => {
    const options: HttpOptions = {
      method: 'post',
      url: url,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json'
      },
      data: params
    };

    try {
      const response = await CapacitorHttp.post(options);

      if (response.status == 200) {
        return response.data;
      }
      else {
        return Promise.reject(response);
      }
    }
    catch (error: any) {
      return Promise.reject(error);
    }
  }
  public patch = async (url: string, params: any) => {
    const options: HttpOptions = {
      method: 'patch',
      url: url,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json'
      },
      data: params
    };

    try {
      const response = await CapacitorHttp.patch(options);

      if (response.status == 200) {
        return response.data;
      }
      else {
        return Promise.reject(response);
      }
    }
    catch (error: any) {
      return Promise.reject(error);
    }
  }
  async getImage(url: string): Promise<any> {
    const options: HttpOptions = {
      url: `${this.baseUrl}/v3/${url}`,
      responseType: 'blob',
      headers: {}
    };

    try {
      const response = await CapacitorHttp.get(options);

      if (response.status == 200) {
        return response.data;
      }
      else {
        return Promise.reject(response);
      }
    }
    catch (error: any) { }
  }
  async getBlob(url: string): Promise<any> {
    const options: HttpOptions = {
      url: url,
      responseType: 'blob',
      headers: {}
    };

    try {
      const response = await CapacitorHttp.get(options);

      if (response.status == 200) {
        return response.data;
      }
      else {
        return Promise.reject(response);
      }
    }
    catch (error: any) { }
  }
  getPrincipal() {
    return this.get(`${this.baseUrl}/v5/principal`);
  }
  getAppVersion() {
    return this.get(`${this.baseUrl}/app-version`);
  }
  getContacto() {
    return this.get(`${this.baseUrl}/v3/contacto`);
  }
  validarCodigoDocumento(codigoVerificacion: string) {
    return this.get(`${this.baseUrl}/v5/validar-codigo-documento?codigoVerificacion=${codigoVerificacion}`);
  }
  validarDocumento(params: any) {
    return this.post(`${this.baseUrl}/v5/validar-documento`, params);
  }
  marcarVistaPublica(apesTevento: string, apesTdescripcion?: string, apesTvalor?: string) {
    if (this.global.Integration) {
      return;
    }

    try {
      let params = {
        apesTevento: apesTevento,
        apesTdescripcion: apesTdescripcion || '',
        apesTvalor: apesTvalor || '',
        apesTdispositivoUuid: '', //this.device.uuid,
        apesTdispositivoIp: '',
        apesTdispositivoLatLng: '',
        audiTusuario: 'MOVIL'
      };
      this.post(`${this.baseUrl}/v3/marcar-vista`, params);
    }
    catch { }
  }
  registrarDispositivo(params: any) {
    return this.patch(`${this.baseUrl}/v5/dispositivo`, params);
  }
  async getStorage(key: string) {
    return Preferences.get({ key: `${this.storagePrefix}-${key}` }).then(result => {
      return result.value ? JSON.parse(result.value) : null;
    });
  }
  async setStorage(key: string, value: any) {
    await Preferences.set({
      key: `${this.storagePrefix}-${key}`,
      value: JSON.stringify(value)
    });
  }
  async removeStorage(key: string) {
    await Preferences.remove({ key: `${this.storagePrefix}-${key}` });
  }
  async clearStorage() { }

}
