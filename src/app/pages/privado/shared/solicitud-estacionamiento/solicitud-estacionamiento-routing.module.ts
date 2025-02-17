import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitudEstacionamientoPage } from './solicitud-estacionamiento.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudEstacionamientoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudEstacionamientoPageRoutingModule { }
