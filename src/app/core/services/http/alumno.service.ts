import { Injectable } from '@angular/core';
import { PrivateService } from '../http/private.service';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService extends PrivateService {

  public override storagePrefix: string = 'Alumno-MOVIL';

  constructor() {
    super();
  }

  getNotificaciones(sedeCcod: string, npreTuuid: string): Promise<any> {
    return this.get(`${this.baseUrl}/v5/alumno/notificaciones?sedeCcod=${sedeCcod}&npreTuuid=${npreTuuid}`);
  }
  eliminarNotificacion(params: any): Promise<any> {
    return this.delete(`${this.baseUrl}/v5/alumno/eliminar-notificacion`, params);
  }
  eliminarTodasNotificaciones(params: any): Promise<any> {
    return this.delete(`${this.baseUrl}/v5/alumno/eliminar-todas-notificaciones`, params);
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
  getAgenda(sedeCcod: any, periCcod: any, fechaInicio: any, fechaTermino: any, virtuales?: any): Promise<any> {
    return this.get(`${this.baseUrl}/v5/alumno/agenda?sedeCcod=${sedeCcod}&periCcod=${periCcod}&fechaInicio=${fechaInicio}&fechaTermino=${fechaTermino}&virtuales=${virtuales || 0}`);
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
  getAgendaSeccion(sedeCcod: any, periCcod: string, seccCcod: any, fechaInicio: string, fechaTermino: string) {
    fechaInicio = encodeURIComponent(fechaInicio);
    fechaTermino = encodeURIComponent(fechaTermino);
    return this.get(`${this.baseUrl}/v5/alumno/detalle-curso/agenda?sedeCcod=${sedeCcod}&periCcod=${periCcod}&seccCcod=${seccCcod}&fechaInicio=${fechaInicio}&fechaTermino=${fechaTermino}`);
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
  getAsesorPedagogicoV5(sedeCcod: string): Promise<any> {
    return this.get(`${this.baseUrl}/v5/alumno/asesor-pedagogico?sedeCcod=${sedeCcod}`);
  }
  // GRATUIDAD
  getGratiudad() {
    return this.get(`${this.baseUrl}/v4/alumno/gratuidad/principal`);
  }
  solicitarDevolucion(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v4/alumno/gratuidad/solicitud`, params);
  }
  getEvalDiagnostica() {
    return this.get(`${this.baseUrl}/v4/alumno/resultados-eval-diagnostica`);
  }
  getDirectorCarrera(sedeCcod: string, carrCcod: string): Promise<any> {
    carrCcod = encodeURIComponent(carrCcod);
    return this.get(`${this.baseUrl}/v5/alumno/director-carrera?sedeCcod=${sedeCcod}&carrCcod=${carrCcod}`);
  }
  getDocentesV5(carrCcod: any): Promise<any> {
    carrCcod = encodeURIComponent(carrCcod);
    return this.get(`${this.baseUrl}/v5/alumno/docentes?carrCcod=${carrCcod}`);
  }
  getPracticasPrincipal(sedeCcod: number, planCcod: number, carrCcod: string): Promise<any> {
    carrCcod = encodeURIComponent(carrCcod);
    return this.get(`${this.baseUrl}/v5/alumno/practicas/principal?sedeCcod=${sedeCcod}&planCcod=${planCcod}&carrCcod=${carrCcod}`);
  }
  getFiltrosPracticas(sedeCcod: number, carrCcod: string) {
    carrCcod = encodeURIComponent(carrCcod);
    return this.get(`${this.baseUrl}/v5/alumno/practicas/filtros?sedeCcod=${sedeCcod}&carrCcod=${carrCcod}`);
  }
  filtrarPracticas(career: number, region: number, page: number) {
    return this.get(`${this.baseUrl}/v5/alumno/practicas/filtrar?career=${career}&region=${region}&page=${page}`);
  }
  getBloqueos(): Promise<any> {
    return this.get(`${this.baseUrl}/v3/alumno/situaciones-pendientes`);
  }
  getDAEV5(sedeCcod: any) {
    return this.get(`${this.baseUrl}/v5/alumno/dae?sedeCcod=${sedeCcod}`);
  }
  getDelegadosV5(sedeCcod: any, carrCcod: any, jornCcod: any, nombreDelegado: any) {
    return this.get(`${this.baseUrl}/v5/alumno/delegados?sedeCcod=${sedeCcod}&carrCcod=${carrCcod}&jornCcod=${jornCcod}&nombreDelegado=${nombreDelegado}`);
  }
  getActividadesInscripcion(sedeCcod: any) {
    return this.get(`${this.baseUrl}/v5/alumno/actividades-inscripcion?sedeCcod=${sedeCcod}`);
  }
  guardarInscripcionActividad(params: any) {
    return this.post(`${this.baseUrl}/v3/alumno/guardar-inscripcion-actividad`, params);
  }

  // Perfil
  getEstadoFotoPerfil() {
    return this.get(`${this.baseUrl}/v5/alumno/estado-foto-perfil`);
  }
}
