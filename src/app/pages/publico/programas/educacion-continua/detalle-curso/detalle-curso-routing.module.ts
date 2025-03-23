import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleCursoPage } from './detalle-curso.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleCursoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleCursoPageRoutingModule {}
