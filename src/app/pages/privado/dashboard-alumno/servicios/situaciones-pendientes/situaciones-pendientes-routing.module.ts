import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SituacionesPendientesPage } from './situaciones-pendientes.page';

const routes: Routes = [
  {
    path: '',
    component: SituacionesPendientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SituacionesPendientesPageRoutingModule { }
