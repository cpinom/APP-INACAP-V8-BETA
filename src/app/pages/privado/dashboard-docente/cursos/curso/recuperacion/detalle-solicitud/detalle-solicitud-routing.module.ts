import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleSolicitudPage } from './detalle-solicitud.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleSolicitudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleSolicitudPageRoutingModule { }
