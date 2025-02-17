import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';
import { AppGlobal } from 'src/app/app.global';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  baseUrl: string = '';
  storagePrefix: string = 'Public-MOVIL';

  constructor(private global: AppGlobal) {
    this.baseUrl = this.global.Api;
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

  async getImage(url: string): Promise<any> {
    const options: HttpOptions = {
      url: `${this.baseUrl}/api/v3/${url}`,
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
  getContacto() {
    return this.get(`${this.baseUrl}/api/v3/contacto`);
  }
  validarCodigoDocumento(codigoVerificacion: string) {
    return this.get(`${this.baseUrl}/api/v5/validar-codigo-documento?codigoVerificacion=${codigoVerificacion}`);
  }
  validarDocumento(params: any) {
    return this.post(`${this.baseUrl}/api/v5/validar-documento`, params);
  }

}
