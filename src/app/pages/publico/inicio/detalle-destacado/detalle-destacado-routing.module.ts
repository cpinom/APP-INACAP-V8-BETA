import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleDestacadoPage } from './detalle-destacado.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleDestacadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleDestacadoPageRoutingModule { }
