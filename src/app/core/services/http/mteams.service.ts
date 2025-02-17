import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class MicrosoftTeamsService extends PrivateService {

  public override storagePrefix: string = 'MicrosoftTeams-MOVIL';
  private apiPrefix = 'api/v3/microsoftteams';

  constructor() {
    super();
    this.baseUrl = `${this.global.Api}/${this.apiPrefix}`;
  }
  getEventos() {
    return this.get(`${this.baseUrl}/eventos`);
  }
  agregarEvento(params: any) {
    return this.post(`${this.baseUrl}/crear-evento`, params);
  }
  eliminarEvento(params: any) {
    return this.post(`${this.baseUrl}/eliminar-evento`, params);
  }
  override async clearStorage() {
    await Preferences.remove({ key: `${this.storagePrefix}-equipos` });
    await Preferences.remove({ key: `${this.storagePrefix}-eventos` });
    await Preferences.remove({ key: `${this.storagePrefix}-cursos` });
  }

}
