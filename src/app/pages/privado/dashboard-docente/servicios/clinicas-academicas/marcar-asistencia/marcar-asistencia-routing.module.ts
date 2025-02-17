import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarcarAsistenciaPage } from './marcar-asistencia.page';

const routes: Routes = [
  {
    path: '',
    component: MarcarAsistenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarcarAsistenciaPageRoutingModule {}
