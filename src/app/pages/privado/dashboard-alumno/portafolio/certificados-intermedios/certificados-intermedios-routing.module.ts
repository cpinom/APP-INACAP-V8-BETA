import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CertificadosIntermediosPage } from './certificados-intermedios.page';

const routes: Routes = [
  {
    path: '',
    component: CertificadosIntermediosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CertificadosIntermediosPageRoutingModule {}
