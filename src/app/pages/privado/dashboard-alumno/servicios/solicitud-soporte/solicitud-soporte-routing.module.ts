import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitudSoportePage } from './solicitud-soporte.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudSoportePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudSoportePageRoutingModule { }
