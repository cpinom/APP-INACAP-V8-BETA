import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosEmergenciaPage } from './datos-emergencia.page';

const routes: Routes = [
  {
    path: '',
    component: DatosEmergenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosEmergenciaPageRoutingModule {}
