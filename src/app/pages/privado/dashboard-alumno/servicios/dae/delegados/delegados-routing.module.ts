import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DelegadosPage } from './delegados.page';

const routes: Routes = [
  {
    path: '',
    component: DelegadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DelegadosPageRoutingModule { }
