import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppEvent, Ingreso, Salida } from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  /** Eventos globales para la APP */
  app = new Subject<AppEvent>();
  /** Evento Ingreso Intranet */
  onLogin = new Subject<Ingreso>();
  /** Evento Salida Intranet */
  onLogout = new Subject<Salida>();
}
