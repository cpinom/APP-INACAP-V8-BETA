import { Injectable } from "@angular/core";
import { PublicService } from "./public.service";
import { Preferences } from "@capacitor/preferences";

@Injectable({
  providedIn: 'root'
})
export class ConsultaBipService extends PublicService {

  override storagePrefix: string = 'Bip-MOVIL';

  constructor() {
    super();
  }
  getSaldoBip(params: any) {
    return this.post(`${this.baseUrl}/v3/saldo-bip`, params);
  }
  override async clearStorage() {
    await Preferences.remove({ key: `${this.storagePrefix}-alumno-tarjetas` });
    await Preferences.remove({ key: `${this.storagePrefix}-docente-tarjetas` });
  }

}