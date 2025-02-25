import { Injectable } from '@angular/core';
import { PrivateService } from '../http/private.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class DocenteService extends PrivateService {

  public override storagePrefix: string = 'Docente-MOVIL';

  constructor() {
    super();
  }

  getPrincipalV6() {
    return this.get(`${this.baseUrl}/docente/v6/principal`);
  }
  getHorarioV6(fechaInicio: any, fechaTermino: any): Promise<any> {
    return this.get(`${this.baseUrl}/docente/v6/horario?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaTermino=${encodeURIComponent(fechaTermino)}`);
  }
  getPerfilV6(sedeCcod: any) {
    return this.get(`${this.baseUrl}/docente/v6/perfil?sedeCcod=${sedeCcod}`);
  }
  validarFotoPerfilWeb(data: FormData, params?: any): Promise<any> {
    return Promise.resolve({});
    // return this.uploadWeb(`${this.baseUrl}/v3/docente/validar-foto-perfil`, data, params);
  }
  validarFotoPerfil(filepath: string, filename: string, params?: any): Promise<any> {
    return Promise.resolve({});
    // return this.upload(`${this.baseUrl}/v3/docente/validar-foto-perfil`, filepath, filename, params);
  }
  guardarFotoPerfil(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v3/docente/guardar-foto-perfil`, params);
  }
  getDetalleAlumnoV6(seccCcod: any, persNcorr: any, periCcod: any): Promise<any> {
    return this.get(`${this.baseUrl}/docente/v6/detalle-alumno?seccCcod=${seccCcod}&persNcorr=${persNcorr}&periCcod=${periCcod}`);
  }
  getConfiguracionesV6(sedeCcod: any): Promise<any> {
    return this.get(`${this.baseUrl}/docente/v6/status?sedeCcod=${sedeCcod}`);
  }
  guardarPeriodoV5(params: any): Promise<any> {
    return this.patch(`${this.baseUrl}/v5/docente/guardar-periodo`, params);
  }
  getCorreosV5() {
    return this.get(`${this.baseUrl}/v5/inacapmail/summary`);
  }
  getAlumnos(): Promise<any> {
    return this.get(`${this.baseUrl}/v3/docente/alumnos`);
  }
  getComunicaciones() {
    return this.get(`${this.baseUrl}/docente/v6/comunicaciones`);
  }
  cargarArchivoComunicaciones(messageId: string, params: any) {
    return this.post(`${this.baseUrl}/docente/v6/comunicaciones/cargar-archivo?messageId=${messageId}`, params);
  }
  getDetalleCursoV6(seccCcod: any, ssecNcorr: any): Promise<any> {
    return this.get(`${this.baseUrl}/docente/v6/detalle-curso?seccCcod=${seccCcod}&ssecNcorr=${ssecNcorr}`);
  }
  getDescriptorAsignaturaV6(asigCcod: any): Promise<any> {
    asigCcod = encodeURIComponent(asigCcod);
    return this.get(`${this.baseUrl}/docente/v6/descriptor-asignatura?asigCcod=${asigCcod}`);
  }
  getAlumnosSeccion(seccCcod: any, ssecNcorr: any) {
    return this.get(`${this.baseUrl}/docente/v6/listado-alumnos?seccCcod=${seccCcod}&ssecNcorr=${ssecNcorr}`);
  }
  getRecuperacionClasesV5() {
    return this.get(`${this.baseUrl}/v5/docente/recuperacion-clases`);
  }
  getRecuperacionCursoV5(seccCcod: any, ssecNcorr: any) {
    return this.post(`${this.baseUrl}/v5/docente/recuperacion-clases?seccCcod=${seccCcod}&ssecNcorr=${ssecNcorr}`, {});
  }
  getRecuperacionCursoV6(seccCcod: any) {
    return this.get(`${this.baseUrl}/docente/v6/recuperaciones-curso?seccCcod=${seccCcod}`);
  }
  buscarBloquesDisponiblesV6(fechaConsulta: any, lclaNcorr: any, horaCcod: any, bloqueUnico: any, tsalCcod: any, sedeCcod: any) {
    return this.get(`${this.baseUrl}/docente/v6/buscar-bloques-disponibles?fechaConsulta=${encodeURIComponent(fechaConsulta)}&lclaNcorr=${lclaNcorr}&horaCcod=${horaCcod}&bloqueUnico=${bloqueUnico}&tsalCcod=${tsalCcod}&sedeCcod=${sedeCcod}`)
  }
  solicitarRecuperacionV6(data: any) {
    return this.post(`${this.baseUrl}/docente/v6/solicitud-recuperacion`, data)
  }
  getNotificacionesV6(sedeCcod: any, npreTuuid: any): Promise<any> {
    return this.get(`${this.baseUrl}/docente/v6/notificaciones?sedeCcod=${sedeCcod}&npreTuuid=${npreTuuid}`);
  }
  eliminarNotificacionV6(params: any): Promise<any> {
    return this.delete(`${this.baseUrl}/docente/v6/eliminar-notificacion`, params);
  }
  eliminarTodasNotificacionesV6(params: any): Promise<any> {
    return this.delete(`${this.baseUrl}/docente/v6/eliminar-todas-notificaciones`, params);
  }
  getDirectoresAcademicosV6(sedeCcod: any): Promise<any> {
    return this.get(`${this.baseUrl}/docente/v6/directores-academicos?sedeCcod=${sedeCcod}`);
  }
  getDirectoresCarrerasV6(): Promise<any> {
    return this.get(`${this.baseUrl}/docente/v6/directores-carrera`);
  }
  getPeriodosEvaluacionDocente(): Promise<any> {
    return this.get(`${this.baseUrl}/docente/v6/periodos-evaluacion`);
  }
  getEvaluacionDocenteV6(sedeCcod: any, periCcod: any): Promise<any> {
    return this.get(`${this.baseUrl}/docente/v6/evaluacion-docente?sedeCcod=${sedeCcod}&periCcod=${periCcod}`);
  }
  getFichaAlumnoTutoria(matrNcorr: any, tupaNcorr: any): Promise<any> {
    return this.get(`${this.baseUrl}/docente/v6/ficha-alumno-tutoria?matrNcorr=${matrNcorr}&tupaNcorr=${tupaNcorr}`);
  }
  getEstudiantesTutoriaV6(): Promise<any> {
    return this.get(`${this.baseUrl}/docente/v6/alumnos-tutoria`);
  }
  override async clearStorage() {
    await Preferences.remove({ key: `${this.storagePrefix}-cursos` });
    await Preferences.remove({ key: `${this.storagePrefix}-users` });
  }
}
