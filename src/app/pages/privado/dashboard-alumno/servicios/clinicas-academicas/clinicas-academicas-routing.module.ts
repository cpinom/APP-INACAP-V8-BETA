import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClinicasAcademicasPage } from './clinicas-academicas.page';

const routes: Routes = [
  {
    path: '',
    component: ClinicasAcademicasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClinicasAcademicasPageRoutingModule { }
