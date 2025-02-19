import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevolucionGratuidadPage } from './devolucion-gratuidad.page';

const routes: Routes = [
  {
    path: '',
    component: DevolucionGratuidadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevolucionGratuidadPageRoutingModule {}
