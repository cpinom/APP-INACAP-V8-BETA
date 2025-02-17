import { Injectable } from "@angular/core";
import { Global } from "src/app/app.global";
import { PrivateService } from "./private.service";
import { AuthService } from "./auth.service";
import { HTTP } from "@awesome-cordova-plugins/http/ngx";
import { Preferences } from "@capacitor/preferences";

@Injectable({
  providedIn: 'root'
})
export class EmpleaInacapService extends PrivateService {

  private storagePrefix: string = 'EmpleaInacap-MOVIL';
  private apiPrefix = 'api/emplea-inacap';

  constructor(auth: AuthService, global: Global, http: HTTP) {
    super(auth, global, http);
    this.baseUrl = `${global.Api}/${this.apiPrefix}`;
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
  async clearStorage() {
    await Preferences.remove({ key: `${this.storagePrefix}-filtros` });
  }
}
