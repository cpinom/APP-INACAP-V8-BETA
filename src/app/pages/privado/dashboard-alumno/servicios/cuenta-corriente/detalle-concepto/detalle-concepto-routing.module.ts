import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleConceptoPage } from './detalle-concepto.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleConceptoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleConceptoPageRoutingModule {}
