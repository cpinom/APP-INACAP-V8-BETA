import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InformacionAcademicaPage } from './informacion-academica.page';

const routes: Routes = [
  {
    path: '',
    component: InformacionAcademicaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformacionAcademicaPageRoutingModule { }
