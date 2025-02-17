import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirAcademicoPage } from './dir-academico.page';

const routes: Routes = [
  {
    path: '',
    component: DirAcademicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirAcademicoPageRoutingModule { }
