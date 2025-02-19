import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MesaServiciosPage } from './mesa-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: MesaServiciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesaServiciosPageRoutingModule { }
