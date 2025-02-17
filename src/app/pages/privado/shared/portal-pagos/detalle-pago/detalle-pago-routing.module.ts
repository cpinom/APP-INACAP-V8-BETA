import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetallePagoPage } from './detalle-pago.page';

const routes: Routes = [
  {
    path: '',
    component: DetallePagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallePagoPageRoutingModule { }
