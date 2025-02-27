import { Injectable } from '@angular/core';
import { PrivateService } from './private.service';

@Injectable({
  providedIn: 'root'
})
export class MicrosoftTeamsService extends PrivateService {

  public override storagePrefix: string = 'MicrosoftTeams-MOVIL';

  constructor() {
    super();
    this.baseUrl += `/microsoftteams/v4`;
  }
  getEventos(pageSize: any, skip: any) {
    return this.get(`${this.baseUrl}/eventos?pageSize=${pageSize}&skip=${skip}`);
  }
  eliminarEvento(eventoId: any) {
    return this.delete(`${this.baseUrl}/eliminar-evento?eventoId=${eventoId}`);
  }

}
