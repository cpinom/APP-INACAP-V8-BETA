import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NuevaSolicitudPage } from './nueva-solicitud.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaSolicitudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaSolicitudPageRoutingModule { }
