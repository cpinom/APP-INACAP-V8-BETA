import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';
import { AppGlobal } from 'src/app/app.global';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class PrivateService {

  private auth = inject(AuthService);
  global = inject(AppGlobal);
  storagePrefix: string = 'Private-MOVIL';
  baseUrl = `${inject(AppGlobal).Api}/api`;

  constructor() { }

  public get = async (url: string) => {
    const auth = await this.auth.getAuth();

    if (auth == null) {
      throw Error('ACCESS_TOKEN_MISSING');
    }

    const options: HttpOptions = {
      url: url,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.access_token}`
      }
    };

    const response = await CapacitorHttp.get(options);

    if (response.status == 200) {
      return response.data;
    }

    return Promise.reject(response);
  }
  public post = async (url: string, params: any) => {
    const auth = await this.auth.getAuth();

    if (auth == null) {
      throw Error('ACCESS_TOKEN_MISSING');
    }

    const options: HttpOptions = {
      url: url,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.access_token}`
      },
      data: params
    };

    const response = await CapacitorHttp.post(options);

    if (response.status == 200) {
      return response.data;
    }

    return Promise.reject(response);
  }
  public patch = async (url: string, params?: any) => {
    const auth = await this.auth.getAuth();

    if (auth == null) {
      throw Error('ACCESS_TOKEN_MISSING');
    }

    const options: HttpOptions = {
      url: url,
      method: 'patch',
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.access_token}`
      },
      data: params || {}
    };

    const response = await CapacitorHttp.patch(options);

    if (response.status == 200) {
      return response.data;
    }

    return Promise.reject(response);
  }
  public delete = async (url: string, params?: any) => {
    const auth = await this.auth.getAuth();

    if (auth == null) {
      throw Error('ACCESS_TOKEN_MISSING');
    }

    const options: HttpOptions = {
      url: url,
      method: 'delete',
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.access_token}`
      },
      data: params || {}
    };

    const response = await CapacitorHttp.delete(options);

    if (response.status == 200) {
      return response.data;
    }

    return Promise.reject(response);
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
  async clearStorage() {
    await Preferences.remove({ key: `${this.storagePrefix}-seccion` });
    await Preferences.remove({ key: `${this.storagePrefix}-cursos` });
    await Preferences.remove({ key: `${this.storagePrefix}-users` });
    await Preferences.remove({ key: `${this.storagePrefix}-filtros-practicas` });
  }

  registrarAcceso(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v3/acceso`, params);
  }
  async registrarSalida(direTuuid: string): Promise<any> {
    const options: HttpOptions = {
      url: `${this.baseUrl}/v5/salida?direTuuid=${direTuuid}`,
      method: 'patch',
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
      }
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
    catch { }
  }

  getPreferencias(): Promise<any> {
    return this.get(`${this.baseUrl}/v3/persona/preferencias`);
  }
  guardarPreferencias(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v3/persona/preferencias`, params);
  }
  confirmarTelefono(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v4/persona/confirmar-telefono`, params);
  }
  confirmarPin(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v4/persona/confirmar-pin`, params);
  }
  confirmarCorreo(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v4/persona/confirmar-correo`, params);
  }
  actualizarCorreoSecundario(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v4/persona/actualizar-correo-secundario`, params);
  }
  getDetalleSedeV5(sedeCcod: any) {
    return this.get(`${this.baseUrl}/v5/detalle-sede?sedeCcod=${sedeCcod}`);
  }
  descargarMenuCafeteria(params: any) {
    return this.post(`${this.baseUrl}/v4/detalle-sede/menu-cafeteria`, params);
  }
  marcarVista(apesTevento: string, apesTdescripcion?: string, apesTvalor?: string) {
    if (!this.global.Integration) {
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
        this.post(`${this.global.Api}/v3/marcar-vista-cuenta`, params);
      }
      catch { }
    }
  }

}
