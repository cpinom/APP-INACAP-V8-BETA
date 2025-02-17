import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class CertificadosService extends PrivateService {

  public override storagePrefix: string = 'Certificados-MOVIL';

  constructor() {
    super();
    this.baseUrl = `${this.global.Api}/api`;
  }
  generaCarro(params: any) {
    return this.post(`${this.baseUrl}/v3/certificados/genera-carro`, params);
  }
  getPeriodos() {
    return this.get(`${this.baseUrl}/v3/certificados/periodos`);
  }
  getPrincipalV3(params: any) {
    return this.post(`${this.baseUrl}/v3/certificados/principal`, params);
  }
  getPrincipalV4(params: any) {
    return this.post(`${this.baseUrl}/v4/certificados/principal`, params);
  }
  getCertificados(params: any) {
    return this.post(`${this.baseUrl}/v4/certificados/certificados`, params);
  }
  getCertificadosV5(periCcod: any, espeCcod: any, planCcod: any, exAlumno: any) {
    return this.get(`${this.baseUrl}/v4/certificados/certificados?periCcod=${periCcod}&espeCcod=${espeCcod}&planCcod=${planCcod}&exAlumno=${exAlumno}`);
  }
  getDetalleCertificado(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v3/certificados/detalle-certificado`, params);
  }
  solicitarCertificado(params: any) {
    return this.post(`${this.baseUrl}/v3/certificados/solicitar-certificado`, params);
  }
  solicitarCertificadoV4(params: any) {
    return this.post(`${this.baseUrl}/v4/certificados/solicitar-certificado`, params);
  }
  eliminarCertificado(params: any) {
    return this.post(`${this.baseUrl}/v3/certificados/eliminar-certificado`, params);
  }
  enviarCorreo(params: any) {
    return this.post(`${this.baseUrl}/v3/certificados/enviar-correo`, params);
  }
  descargarCertificado(params: any) {
    return this.post(`${this.baseUrl}/v3/certificados/descargar-certificado`, params);
  }
  descargarCertificadoV5(mcerNcorr: any, tdetCcod: any, codVerif: any) {
    return this.get(`${this.baseUrl}/v5/certificados/descargar-certificado?mcerNcorr=${mcerNcorr}&tdetCcod=${tdetCcod}&codVerif=${codVerif}`);
  }
  descargarImagen(params: any) {
    return this.post(`${this.baseUrl}/v3/certificados/descargar-imagen`, params);
  }
  getCredencialesDigitales(params: any) {
    return this.post(`${this.baseUrl}/v4/credenciales-digitales/principal`, params);
  }
  getCredencialesDigitales2(params: any) {
    return this.post(`${this.baseUrl}/v4/credenciales-digitales/certificados`, params);
  }
  descargarCredencialPdf(params: any) {
    return this.post(`${this.baseUrl}/v4/credenciales-digitales/descargar-pdf`, params);
  }
  descargarCredencialImagen(params: any) {
    return this.post(`${this.baseUrl}/v4/credenciales-digitales/descargar-imagen`, params);
  }
  override async clearStorage() {
    await Preferences.remove({ key: `${this.storagePrefix}-periodo` });
    await Preferences.remove({ key: `${this.storagePrefix}-carrCcod` });
  }
}
