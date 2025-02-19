import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirectorCarreraPage } from './director-carrera.page';

const routes: Routes = [
  {
    path: '',
    component: DirectorCarreraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirectorCarreraPageRoutingModule { }
