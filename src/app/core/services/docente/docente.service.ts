import { inject, Injectable } from '@angular/core';
import { PrivateService } from '../private.service';
import { AppGlobal } from 'src/app/app.global';

@Injectable({
  providedIn: 'root'
})
export class DocenteService extends PrivateService {

  private baseUrl = inject(AppGlobal).Api;

  constructor() {
    super();
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
}
