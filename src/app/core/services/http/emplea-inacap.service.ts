import { Injectable } from "@angular/core";
import { PrivateService } from "./private.service";
import { Preferences } from "@capacitor/preferences";

@Injectable({
  providedIn: 'root'
})
export class EmpleaInacapService extends PrivateService {

  public override storagePrefix: string = 'EmpleaInacap-MOVIL';

  constructor() {
    super();
    this.baseUrl = `${this.global.Api}/emplea-inacap`;
  }

  getFiltrosExalumno() {
    return this.get(`${this.baseUrl}/v1/filtros-exalumno`);
  }
  getFiltrosAlumno(sedeCcod: any, carrCcod: any) {
    carrCcod = encodeURIComponent(carrCcod);
    return this.get(`${this.baseUrl}/v1/filtros-alumno?sedeCcod=${sedeCcod}&carrCcod=${carrCcod}`);
  }
  getComunas(region: any) {
    return this.get(`${this.baseUrl}/v1/comunas?region=${region}`);
  }
  getEmpleos(carrera: number, region: number, comuna: number, tipo: number, filtro: string, page: number) {
    return this.get(`${this.baseUrl}/v1/empleos?carrera=${carrera}&region=${region}&comuna=${comuna}&tipo=${tipo}&filtro=${filtro}&page=${page}`);
  }
  override async clearStorage() {
    await Preferences.remove({ key: `${this.storagePrefix}-filtros` });
  }
}
