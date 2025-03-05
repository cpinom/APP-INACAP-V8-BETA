import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiesgosAcademicosPage } from './riesgos-academicos.page';

const routes: Routes = [
  {
    path: '',
    component: RiesgosAcademicosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiesgosAcademicosPageRoutingModule {}
