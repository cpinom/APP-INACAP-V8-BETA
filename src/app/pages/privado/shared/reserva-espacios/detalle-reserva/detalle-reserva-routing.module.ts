import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleReservaPage } from './detalle-reserva.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleReservaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleReservaPageRoutingModule { }
