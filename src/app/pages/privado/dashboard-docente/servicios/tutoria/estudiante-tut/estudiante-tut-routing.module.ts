import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstudianteTutPage } from './estudiante-tut.page';

const routes: Routes = [
  {
    path: '',
    component: EstudianteTutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstudianteTutPageRoutingModule { }
