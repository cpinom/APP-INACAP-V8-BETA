import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirCarreraPage } from './dir-carrera.page';

const routes: Routes = [
  {
    path: '',
    component: DirCarreraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirCarreraPageRoutingModule { }
