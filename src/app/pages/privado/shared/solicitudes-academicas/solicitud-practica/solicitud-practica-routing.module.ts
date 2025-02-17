import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitudPracticaPage } from './solicitud-practica.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudPracticaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudPracticaPageRoutingModule { }
