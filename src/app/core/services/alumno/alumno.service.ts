import { Injectable } from '@angular/core';
import { PrivateService } from '../private.service';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService extends PrivateService {

  public override storagePrefix: string = 'Alumno-MOVIL';
  public override baseUrl = `${this.global.Api}/api`;

  constructor() {
    super();
  }

  getHorario(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v4/alumno/horario`, params);
  }
  getHorarioV5(params: any): Promise<any> {
    return this.post(`${this.baseUrl}/v5/alumno/horario`, params);
  }
}
