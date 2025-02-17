import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitarRecuperacionPage } from './solicitar-recuperacion.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitarRecuperacionPage 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitarRecuperacionPageRoutingModule { }
