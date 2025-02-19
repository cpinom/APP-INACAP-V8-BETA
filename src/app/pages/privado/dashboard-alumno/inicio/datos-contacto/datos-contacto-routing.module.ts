import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatosContactoPage } from './datos-contacto.page';

const routes: Routes = [
  {
    path: '',
    component: DatosContactoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosContactoPageRoutingModule {}
