import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleInacapPage } from './detalle-inacap.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleInacapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleInacapPageRoutingModule { }
