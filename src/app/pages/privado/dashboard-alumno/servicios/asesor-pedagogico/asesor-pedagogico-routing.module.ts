import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsesorPedagogicoPage } from './asesor-pedagogico.page';

const routes: Routes = [
  {
    path: '',
    component: AsesorPedagogicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsesorPedagogicoPageRoutingModule {}
