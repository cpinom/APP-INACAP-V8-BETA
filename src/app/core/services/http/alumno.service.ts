import { Injectable } from '@angular/core';
import { PrivateService } from '../http/private.service';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService extends PrivateService {

  public override storagePrefix: string = 'Alumno-MOVIL';
  public override baseUrl = `${this.global.Api}/api`;

  constructor() {
    super();
  }

  getPrincipalV5() {
    return this.get(`${this.baseUrl}/v5/alumno/principal`);
  }
  getStatusV5(sedeCcod: string, planCcod: any): Promise<any> {
    return this.get(`${this.baseUrl}/v5/alumno/status?sedeCcod=${sedeCcod}&planCcod=${planCcod}`);
  }
  guardarPeriodo(params: any) {
    return this.post(`${this.baseUrl}/v3/alumno/guardar-periodo`, params);
  }
  getPerfilV5(sedeCcod: any) {
    return this.get(`${this.baseUrl}/v5/alumno/perfil?sedeCcod=${sedeCcod}`);
  }
  getHorario(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v4/alumno/horario`, params);
  }
  getHorarioV5(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v5/alumno/horario`, params);
  }
  getAlumnos(): Promise<any> {
    return this.get(`${this.baseUrl}/v4/alumno/alumnos`);
  }
  getMallaCurricularV5(periCcod: any, planCcod: any): Promise<any> {
    return this.get(`${this.baseUrl}/v5/alumno/malla-curricular?periCcod=${periCcod}&planCcod=${planCcod}`);
  }
  getProgresionV5(carrCcod: any): Promise<any> {
    carrCcod = encodeURIComponent(carrCcod);
    return this.get(`${this.baseUrl}/v5/alumno/progresion?carrCcod=${carrCcod}`);
  }
  getAcuerdoTutorial(): Promise<any> {
    return this.get(`${this.baseUrl}/v4/alumno/acuerdo-tutorial`);
  }
  enviarAcuerdoTutorial(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v4/alumno/enviar-acuerdo-tutorial`, params);
  }
  getSeccionV5(matrNcorr: any, seccCcod: any, ssecNcorr: any, periCcod: any) {
    return this.get(`${this.baseUrl}/v5/alumno/detalle-curso?matrNcorr=${matrNcorr}&seccCcod=${seccCcod}&ssecNcorr=${ssecNcorr}&periCcod=${periCcod}`);
  }
  getHorarioSeccion(sedeCcod: any, periCcod: string, ssecNcorr: any, fechaInicio: string, fechaTermino: string) {
    fechaInicio = encodeURIComponent(fechaInicio);
    fechaTermino = encodeURIComponent(fechaTermino);
    return this.get(`${this.baseUrl}/v5/alumno/detalle-curso/horario?sedeCcod=${sedeCcod}&periCcod=${periCcod}&ssecNcorr=${ssecNcorr}&fechaInicio=${fechaInicio}&fechaTermino=${fechaTermino}`);
  }
  getAsistencia(seccCcod: any, ssecNcorr: any, periCcod: any) {
    return this.get(`${this.baseUrl}/v5/alumno/detalle-curso/asistencia?seccCcod=${seccCcod}&ssecNcorr=${ssecNcorr}&periCcod=${periCcod}`);
  }
  getAsistenciaV6(matrNcorr: any, seccCcod: any, ssecNcorr: any, periCcod: any) {
    return this.get(`${this.baseUrl}/v6/alumno/detalle-curso/asistencia?matrNcorr=${matrNcorr}&seccCcod=${seccCcod}&ssecNcorr=${ssecNcorr}&periCcod=${periCcod}`);
  }
  getBibliografia(asigCcod: any) {
    return this.get(`${this.baseUrl}/v5/alumno/detalle-curso/bibliografia?asigCcod=${asigCcod}`);
  }
  getAlumnosV5(seccCcod: any) {
    return this.get(`${this.baseUrl}/v5/alumno/detalle-curso/alumnos?seccCcod=${seccCcod}`);
  }
}
