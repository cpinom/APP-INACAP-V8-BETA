import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortafolioPage } from './portafolio.page';

const routes: Routes = [
  {
    path: '',
    component: PortafolioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortafolioPageRoutingModule {}
