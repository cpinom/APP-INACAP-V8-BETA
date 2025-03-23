import { Injectable } from '@angular/core';
import { PublicService } from './public.service';

@Injectable({
  providedIn: 'root'
})
export class EducacionContinuaService extends PublicService {

  constructor() {
    super();
  }
  override getPrincipal() {
    return this.get(`${this.baseUrl}/v4/educacion-continua/principal`);
  }
  getDetalleCurso(params: any) {
    return this.post(`${this.baseUrl}/v3/educacion-continua/detalle-curso`, params);
  }
  filtrarCursos(params: any) {
    return this.post(`${this.baseUrl}/v3/educacion-continua/filtrar-cursos`, params);
  }
}
