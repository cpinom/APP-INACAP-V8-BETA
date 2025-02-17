import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitudDetallePage } from './solicitud-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudDetallePageRoutingModule { }
