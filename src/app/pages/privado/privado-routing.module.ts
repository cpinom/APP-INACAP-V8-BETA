import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivadoPage } from './privado.page';

const routes: Routes = [
  {
    path: '',
    component: PrivadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivadoPageRoutingModule { }
