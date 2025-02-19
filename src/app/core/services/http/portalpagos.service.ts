import { Injectable } from '@angular/core';
import { AppGlobal } from 'src/app/app.global';
import { AuthService } from './auth.service';
import { PrivateService } from './private.service';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class PortalPagosService extends PrivateService {

  private storagePrefix: string = 'PortalPagos-MOVIL';
  private apiPrefix = 'api/v3/portalpagos';

  constructor(auth: AuthService, global: Global, http: HTTP) {
    super(auth, global, http);
    this.baseUrl = `${global.Api}/${this.apiPrefix}`;
  }

  getPrincipal() {
    return this.get(`${this.baseUrl}/principal`);
  }

  getCompromisos(params: any) {
    return this.post(`${this.baseUrl}/compromisos`, params);
  }

  getDetalleCompromiso(params: any) {
    return this.post(`${this.baseUrl}/detalle-compromiso`, params);
  }

  agregarCarro(params: any) {
    return this.post(`${this.baseUrl}/agregar-carro`, params);
  }

  eliminarCarro(params: any) {
    return this.post(`${this.baseUrl}/eliminar-carro`, params);
  }

  solicitarPago(params: any) {
    return this.post(`${this.baseUrl}/solicitar-pago-url`, params);
  }

  getPagoExito(params: any) {
    return this.post(`${this.baseUrl}/pago-exito`, params);
  }

  getPagoFracaso(params: any) {
    return this.post(`${this.baseUrl}/pago-fracaso`, params);
  }

  enviarCorreoComprobante(params: any) {
    return this.post(`${this.baseUrl}/correo-comprobante-pago`, params);
  }

  // descargarComprobante(params: any) {
  //   throw Error('Implementar!');
  //   // let url = `${this.baseUrl}/descargar-comprobante`;
  //   // let options = { Authorization: `Bearer ${this.auth.getAccessToken()}` };

  //   // if (this.global.Integration) {
  //   //     return this.httpClient.post(url, params, { headers: options, responseType: 'blob' }).toPromise();
  //   // }

  //   // return this.http.sendRequest(url, {
  //   //     method: 'post',
  //   //     headers: options,
  //   //     responseType: 'blob',
  //   //     //timeout: 3,
  //   //     data: params
  //   // }).then(response => {
  //   //     return new Blob([response.data], { type: 'application/pdf' });
  //   // });
  // }

  descargarCertificado(params: any) {
    return this.post(`${this.baseUrl}/descargar-certificado`, params);
  }

  async setStorage(key: string, value: any) {
    await Preferences.set({
      key: `${this.storagePrefix}-${key}`,
      value: JSON.stringify(value)
    });
  }

  async getStorage(key: string) {
    return Preferences.get({ key: `${this.storagePrefix}-${key}` }).then(result => {
      return JSON.parse(result.value);
    });
  }

}
