import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PracticaProfesionalPage } from './practica-profesional.page';

const routes: Routes = [
  {
    path: '',
    component: PracticaProfesionalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PracticaProfesionalPageRoutingModule {}
