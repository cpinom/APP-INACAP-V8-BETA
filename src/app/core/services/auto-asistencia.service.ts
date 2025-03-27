import { inject, Injectable } from '@angular/core';
import { DialogService } from './dialog.service';
import { AutoAsistenciaModalComponent } from '../components/auto-asistencia-modal/auto-asistencia-modal.component';

@Injectable({
  providedIn: 'root'
})
export class AutoAsistenciaService {

  private dialog = inject(DialogService);

  constructor() { }

  async mostrarModal(params:any) {

    const modal = await this.dialog.showModal({
      component: AutoAsistenciaModalComponent,
      componentProps: {data:params},
      backdropDismiss: false,
      presentingElement: getRouterOutlet() || undefined
    });

    const result = await modal.onDidDismiss();

    return result.data;

  }

}

export function getRouterOutlet() {
  return document.getElementById('ion-router-outlet-content');
}
