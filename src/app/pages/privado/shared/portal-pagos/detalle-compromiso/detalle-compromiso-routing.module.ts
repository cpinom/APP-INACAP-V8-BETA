import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleCompromisoPage } from './detalle-compromiso.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleCompromisoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleCompromisoPageRoutingModule { }
