import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeneficiosPage } from './beneficios.page';

const routes: Routes = [
  {
    path: '',
    component: BeneficiosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeneficiosPageRoutingModule {}
