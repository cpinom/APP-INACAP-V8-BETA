import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleNotificacionPage } from './detalle-notificacion.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleNotificacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleNotificacionPageRoutingModule { }
